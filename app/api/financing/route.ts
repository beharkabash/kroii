import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@sanity/client';
import { Resend } from 'resend';

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const financingSchema = z.object({
  applicant: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    ssn: z.string().optional(),
    dateOfBirth: z.string().optional(),
    address: z.object({
      street: z.string().min(3, 'Street address is required'),
      city: z.string().min(2, 'City is required'),
      postalCode: z.string().min(5, 'Postal code is required'),
      country: z.string().default('Finland')
    })
  }),
  employment: z.object({
    status: z.enum(['employed', 'self-employed', 'student', 'retired', 'unemployed']),
    employer: z.string().optional(),
    jobTitle: z.string().optional(),
    monthlyIncome: z.number().min(0, 'Monthly income must be positive'),
    employmentDuration: z.number().optional()
  }),
  loanDetails: z.object({
    carId: z.string().optional(),
    vehiclePrice: z.number().min(1000, 'Vehicle price must be at least €1000'),
    downPayment: z.number().min(0, 'Down payment cannot be negative'),
    loanAmount: z.number().min(1000, 'Loan amount must be at least €1000'),
    loanTerm: z.number().min(12).max(96, 'Loan term must be between 12 and 96 months'),
    preferredMonthlyPayment: z.number().optional()
  }),
  gdprConsent: z.boolean().refine(val => val === true, 'GDPR consent is required'),
  creditCheckConsent: z.boolean().refine(val => val === true, 'Credit check consent is required')
});

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 300000; // 5 minutes for financing applications
const MAX_REQUESTS = 2;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter((time: number) => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

// Calculate monthly payment
function calculateMonthlyPayment(principal: number, rate: number, months: number): number {
  const monthlyRate = rate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment * 100) / 100;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (process.env.ENABLE_RATE_LIMITING === 'true' && !checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting another application.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = financingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Validate loan amount vs vehicle price
    if (data.loanDetails.loanAmount > data.loanDetails.vehiclePrice - data.loanDetails.downPayment) {
      return NextResponse.json(
        { error: 'Loan amount cannot exceed vehicle price minus down payment' },
        { status: 400 }
      );
    }

    // Calculate estimated monthly payment (example rate of 4.5%)
    const estimatedRate = 4.5;
    const estimatedPayment = calculateMonthlyPayment(
      data.loanDetails.loanAmount,
      estimatedRate,
      data.loanDetails.loanTerm
    );

    // Save to Sanity
    const application = await sanityClient.create({
      _type: 'financingApplication',
      applicant: data.applicant,
      employment: data.employment,
      loanDetails: {
        ...data.loanDetails,
        car: data.loanDetails.carId ? {
          _type: 'reference',
          _ref: data.loanDetails.carId
        } : undefined
      },
      status: 'submitted',
      gdprConsent: data.gdprConsent,
      creditCheckConsent: data.creditCheckConsent,
      createdAt: new Date().toISOString()
    });

    // Also create a lead for follow-up
    await sanityClient.create({
      _type: 'lead',
      name: `${data.applicant.firstName} ${data.applicant.lastName}`,
      email: data.applicant.email,
      phone: data.applicant.phone,
      message: `Financing application for €${data.loanDetails.loanAmount} over ${data.loanDetails.loanTerm} months`,
      source: 'financing',
      status: 'new',
      carInterest: data.loanDetails.carId ? {
        _type: 'reference',
        _ref: data.loanDetails.carId
      } : undefined,
      gdprConsent: data.gdprConsent,
      createdAt: new Date().toISOString()
    });

    // Send email notifications
    if (process.env.RESEND_API_KEY) {
      try {
        // Email to admin with application details
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@kroiautocenter.fi',
          to: process.env.CONTACT_EMAIL || 'kroiautocenter@gmail.com',
          subject: `New Financing Application - ${data.applicant.firstName} ${data.applicant.lastName}`,
          html: `
            <h2>New Financing Application</h2>
            <h3>Applicant Information</h3>
            <p><strong>Name:</strong> ${data.applicant.firstName} ${data.applicant.lastName}</p>
            <p><strong>Email:</strong> ${data.applicant.email}</p>
            <p><strong>Phone:</strong> ${data.applicant.phone}</p>
            <p><strong>Address:</strong> ${data.applicant.address.street}, ${data.applicant.address.postalCode} ${data.applicant.address.city}</p>

            <h3>Employment Information</h3>
            <p><strong>Status:</strong> ${data.employment.status}</p>
            ${data.employment.employer ? `<p><strong>Employer:</strong> ${data.employment.employer}</p>` : ''}
            <p><strong>Monthly Income:</strong> €${data.employment.monthlyIncome}</p>

            <h3>Loan Details</h3>
            <p><strong>Vehicle Price:</strong> €${data.loanDetails.vehiclePrice}</p>
            <p><strong>Down Payment:</strong> €${data.loanDetails.downPayment}</p>
            <p><strong>Loan Amount:</strong> €${data.loanDetails.loanAmount}</p>
            <p><strong>Loan Term:</strong> ${data.loanDetails.loanTerm} months</p>
            <p><strong>Estimated Monthly Payment:</strong> €${estimatedPayment}</p>

            <hr>
            <p><small>Application ID: ${application._id}</small></p>
          `
        });

        // Confirmation email to applicant
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@kroiautocenter.fi',
          to: data.applicant.email,
          subject: 'Financing Application Received - Kroi Auto Center',
          html: `
            <h2>Financing Application Confirmation</h2>
            <p>Dear ${data.applicant.firstName} ${data.applicant.lastName},</p>
            <p>We have received your financing application with the following details:</p>

            <table style="border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Loan Amount:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">€${data.loanDetails.loanAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Loan Term:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.loanDetails.loanTerm} months</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Estimated Monthly Payment:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">€${estimatedPayment}*</td>
              </tr>
            </table>

            <p><small>*This is an estimated payment based on a ${estimatedRate}% interest rate. Actual rates and payments will be determined after credit review.</small></p>

            <h3>Next Steps</h3>
            <ol>
              <li>Our finance team will review your application within 1-2 business days</li>
              <li>We may contact you for additional information if needed</li>
              <li>Once approved, we'll send you the final loan terms and documentation</li>
            </ol>

            <p>If you have any questions, please don't hesitate to contact us:</p>
            <p>Phone: +358 XX XXX XXXX<br>
            Email: finance@kroiautocenter.fi</p>

            <p>Best regards,<br>
            Kroi Auto Center Finance Team</p>

            <hr>
            <p><small>Application Reference: ${application._id}</small></p>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Financing application submitted successfully',
      applicationId: application._id,
      estimatedMonthlyPayment: estimatedPayment,
      note: 'Your application is under review. We will contact you within 1-2 business days.'
    });

  } catch (error) {
    console.error('Financing application error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your application' },
      { status: 500 }
    );
  }
}

// Calculate financing options
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const principal = Number(searchParams.get('principal'));
    const term = Number(searchParams.get('term'));
    const rate = Number(searchParams.get('rate')) || 4.5;

    if (!principal || !term) {
      return NextResponse.json(
        { error: 'Principal and term parameters are required' },
        { status: 400 }
      );
    }

    const monthlyPayment = calculateMonthlyPayment(principal, rate, term);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - principal;

    return NextResponse.json({
      principal,
      term,
      rate,
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentBreakdown: {
        principal: Math.round((principal / term) * 100) / 100,
        interest: Math.round((totalInterest / term) * 100) / 100
      }
    });

  } catch (error) {
    console.error('Financing calculation error:', error);
    return NextResponse.json(
      { error: 'An error occurred while calculating financing options' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}