# Kroi Auto Center - API Integrations Overview

This document provides a comprehensive overview of all real API integrations implemented in the application.

## What's Been Implemented

### 1. Email Service (Resend) ✅

**Status**: Production-ready with real API integration

**Features**:
- Real email delivery via Resend API
- Professional HTML email templates
- Automatic contact form notifications to business
- Customer auto-responder emails
- Newsletter subscription confirmations
- Exponential backoff retry logic (3 attempts)
- Email delivery tracking and logging
- Error handling with graceful degradation

**Implementation**:
- `/app/lib/email/resend-client.ts` - Resend API client configuration
- `/app/lib/email/email-service.ts` - Email sending logic with retry
- `/app/lib/email/templates/contact-notification.tsx` - Business notification template
- `/app/lib/email/templates/auto-responder.tsx` - Customer confirmation template

**Setup Required**:
1. Sign up at [resend.com](https://resend.com)
2. Get API key (free tier: 3,000 emails/month)
3. Set `RESEND_API_KEY` environment variable
4. Optionally verify your domain for better deliverability

**Cost**: Free tier sufficient for most small businesses

---

### 2. Google Analytics 4 ✅

**Status**: Production-ready with comprehensive event tracking

**Features**:
- Automatic page view tracking
- Privacy-compliant settings (anonymize IP, no personalization)
- Real-time user tracking
- Custom event tracking for business metrics
- Enhanced measurement enabled
- Conversion tracking configured

**Events Tracked**:
- `page_view` - Page navigation
- `view_item` - Car listing views
- `generate_lead` - All contact attempts (form, phone, WhatsApp)
- `car_view` - Detailed car view tracking
- `contact_form_submit` - Form submissions with lead scores
- `whatsapp_click` - WhatsApp button clicks
- `phone_click` - Phone link clicks
- `email_click` - Email link clicks
- `social_click` - Social media interactions
- `newsletter_signup` - Newsletter subscriptions
- `scroll` - Scroll depth tracking (25%, 50%, 75%, 100%)
- `user_engagement` - Time on page tracking

**Implementation**:
- `/app/components/Analytics.tsx` - GA4 script loader with privacy settings
- `/app/lib/analytics.ts` - Type-safe event tracking utilities

**Setup Required**:
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Create Web data stream
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable

**Cost**: Free forever

---

### 3. Contact Form API ✅

**Status**: Production-ready with enterprise-grade security

**Features**:
- Comprehensive input validation with Zod schemas
- XSS and SQL injection prevention
- Input sanitization
- Rate limiting (3 requests/minute per IP)
- Automatic lead scoring (0-100)
- Email notifications (business + customer)
- Analytics event tracking
- Detailed error handling
- Request logging with anonymization

**Lead Scoring Algorithm**:
- Phone number provided: +20 points
- Business email: +10 points
- Full name provided: +10 points
- Detailed message (>100 chars): +30 points
- Specific car interest: +30 points
- Urgent keywords: +10 bonus
- Purchase intent keywords: +10 bonus

**Implementation**:
- `/app/api/contact/route.ts` - Contact API endpoint
- `/app/lib/validation.ts` - Zod schemas and sanitization
- `/app/lib/rate-limit.ts` - Rate limiting middleware
- `/app/lib/lead-scoring.ts` - Lead quality scoring

**Endpoint**: `POST /api/contact`

---

### 4. Newsletter Subscription API ✅

**Status**: Production-ready

**Features**:
- Email validation with Zod
- Rate limiting protection
- Confirmation email delivery
- Input sanitization
- Error handling
- Analytics tracking

**Implementation**:
- `/app/api/newsletter/route.ts` - Newsletter subscription endpoint

**Endpoint**: `POST /api/newsletter`

**Future Enhancement**: Integrate with Resend Audiences or Mailchimp for list management

---

### 5. Rate Limiting System ✅

**Status**: Production-ready

**Features**:
- In-memory rate limiting (scalable to Redis)
- Per-IP tracking
- Configurable limits and windows
- Rate limit headers in responses
- Automatic cleanup of expired entries
- Fallback identifier for proxy environments

**Configuration**:
- Contact forms: 3 requests/minute
- Newsletter: 3 requests/minute
- General API: 30 requests/minute

**Implementation**:
- `/app/lib/rate-limit.ts` - Rate limiting logic

**Future Enhancement**: Redis-based distributed rate limiting for multi-instance deployments

---

### 6. WhatsApp Integration ✅

**Status**: Implemented (enhanced UX recommended)

**Current Features**:
- Floating WhatsApp button
- Direct link to business number
- Pre-filled message with car interest
- Analytics tracking on clicks

**Implementation**:
- Fixed position button on all pages
- Tracked with `trackWhatsAppClick()` function

**Enhancement Recommendations**:
1. Enable WhatsApp Business account
2. Set up auto-reply messages
3. Configure business hours
4. Add quick reply templates

---

## Project Structure

```
app/
├── api/
│   ├── contact/
│   │   └── route.ts          # Contact form endpoint
│   └── newsletter/
│       └── route.ts          # Newsletter subscription endpoint
├── components/
│   └── Analytics.tsx         # GA4 integration component
└── lib/
    ├── analytics.ts          # Analytics tracking utilities
    ├── lead-scoring.ts       # Lead quality scoring
    ├── rate-limit.ts         # Rate limiting middleware
    ├── validation.ts         # Input validation schemas
    └── email/
        ├── resend-client.ts  # Resend API configuration
        ├── email-service.ts  # Email sending service
        └── templates/
            ├── contact-notification.tsx
            └── auto-responder.tsx
```

---

## Environment Variables

Required for full functionality:

```bash
# Email Service (Required)
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@kroiautocenter.fi
CONTACT_EMAIL=kroiautocenter@gmail.com

# Analytics (Required)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Rate Limiting (Optional - defaults provided)
ENABLE_RATE_LIMITING=true
RATE_LIMIT_MAX_REQUESTS=3
RATE_LIMIT_WINDOW_MS=60000

# Application
NEXT_PUBLIC_SITE_URL=https://kroiautocenter.fi
```

See `.env.example` for complete documentation.

---

## Setup Quick Start

### 1. Install Dependencies

```bash
npm install
```

Dependencies include:
- `resend` - Email API client
- `zod` - Schema validation
- `@react-email/render` - Email template rendering
- `@react-email/components` - Email components

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local and add your API keys
```

### 3. Get API Keys

**Resend** (5 minutes):
1. Go to [resend.com](https://resend.com)
2. Sign up and verify email
3. Create API key
4. Copy to `RESEND_API_KEY`

**Google Analytics** (10 minutes):
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property and data stream
3. Copy Measurement ID to `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### 4. Test Locally

```bash
npm run dev

# Open http://localhost:3000
# Submit test contact form
# Check email inbox and GA4 Realtime
```

### 5. Deploy to Production

```bash
# Add environment variables in Vercel/hosting platform
# Deploy application
# Test all integrations
```

---

## Documentation

Comprehensive documentation available:

- **[INTEGRATION_SETUP.md](./INTEGRATION_SETUP.md)** - Step-by-step setup guide for all integrations
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[.env.example](./.env.example)** - Environment variable documentation

---

## Testing

### Contact Form Test

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+358 40 123 4567",
    "message": "This is a test message with enough characters to pass validation.",
    "carInterest": "BMW 320d 2020"
  }'
```

### Newsletter Test

```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Analytics Test

1. Open site in browser
2. Open browser DevTools Console
3. Navigate through pages
4. Click WhatsApp button
5. Submit contact form
6. Check GA4 Realtime reports

---

## Monitoring

### Email Delivery

**Resend Dashboard**:
- Go to [resend.com/emails](https://resend.com/emails)
- Check delivery status, opens, clicks
- Monitor bounce rates
- Review error logs

**What to Monitor**:
- Delivery rate should be >95%
- Bounce rate should be <2%
- Check for spam complaints

### Analytics

**GA4 Dashboard**:
- Go to Reports → Realtime (instant data)
- Go to Reports → Engagement → Events (24h delay)
- Check conversion events

**Key Metrics**:
- Daily active users
- Contact form conversion rate (target: >2%)
- WhatsApp click rate
- Most viewed cars
- Average lead score

### Server Logs

Check application logs for:
```
[CONTACT FORM] New submission
[EMAIL] All emails sent successfully
[Analytics] Contact form submission
[RATE LIMIT] (should be rare)
```

---

## Cost Breakdown

| Service | Free Tier | Paid Plans | Current Usage |
|---------|-----------|------------|---------------|
| Resend | 3,000 emails/month | $20/mo for 50,000 | ~100-500/month |
| Google Analytics | Unlimited | N/A (always free) | Unlimited |
| Vercel Hosting | 100GB bandwidth | $20/mo Pro | Within free tier |
| **Total Monthly** | **$0** | **$0-20** | **$0** |

All integrations can run on free tiers for small to medium businesses.

---

## Security Features

### Input Validation
- Zod schema validation
- Email format verification
- Phone number validation
- Message length limits
- Character whitelisting

### XSS Prevention
- HTML tag removal
- JavaScript protocol blocking
- Event handler removal
- Dangerous pattern detection

### Rate Limiting
- Per-IP request tracking
- Configurable limits
- Automatic blocking
- Clean expired entries

### Data Protection
- Input sanitization
- No sensitive data stored
- Email hashing in logs
- IP anonymization
- GDPR compliant

### Error Handling
- Never expose internal errors
- Generic error messages
- Detailed logging (server-only)
- Graceful degradation

---

## Performance Optimizations

### Email Sending
- Parallel email dispatch
- Non-blocking execution
- Exponential backoff retry
- Failed email logging (doesn't block response)

### Analytics
- Lazy script loading (`afterInteractive`)
- Minimal bundle impact
- Event batching
- Local tracking queue

### Rate Limiting
- In-memory caching
- Efficient cleanup
- O(1) lookup time
- Low memory footprint

---

## Future Enhancements

### Short Term (1-3 months)
- [ ] Database integration for lead storage
- [ ] Admin dashboard for leads
- [ ] CRM integration (HubSpot/Salesforce)
- [ ] SMS notifications via Twilio
- [ ] File upload support (driver's license, etc.)

### Medium Term (3-6 months)
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Lead nurturing automation
- [ ] Multi-language support
- [ ] Mobile app integration

### Long Term (6-12 months)
- [ ] AI-powered lead qualification
- [ ] Chatbot integration
- [ ] Video call booking
- [ ] Virtual car tours
- [ ] Financing calculator API

---

## Troubleshooting

### Common Issues

**1. Emails not sending**
- ✅ Check `RESEND_API_KEY` is set
- ✅ Verify domain in Resend dashboard
- ✅ Check Resend logs for errors
- ✅ Ensure FROM_EMAIL domain is verified

**2. Analytics not tracking**
- ✅ Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` format
- ✅ Disable ad blockers
- ✅ Wait 24 hours for event processing
- ✅ Check GA4 Realtime for instant data

**3. Rate limiting blocking users**
- ✅ Increase `RATE_LIMIT_MAX_REQUESTS`
- ✅ Check server logs for IP patterns
- ✅ Consider Redis for better tracking

**4. Form validation errors**
- ✅ Check Zod schema requirements
- ✅ Verify regex patterns
- ✅ Test with Finnish characters (ä, ö, å)

---

## Support

For integration help:

- **Email**: kroiautocenter@gmail.com
- **Phone**: +358 41 3188214
- **Documentation**: See `/INTEGRATION_SETUP.md` and `/API_DOCUMENTATION.md`

---

## Version History

- **v1.0.0** (2025-09-27) - Initial implementation
  - Resend email integration
  - Google Analytics 4
  - Contact form API
  - Newsletter API
  - Rate limiting
  - Lead scoring
  - Comprehensive documentation

---

**Status**: Production-Ready ✅
**Last Updated**: 2025-09-27