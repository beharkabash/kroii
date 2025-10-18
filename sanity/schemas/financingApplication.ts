export default {
  name: 'financingApplication',
  title: 'Financing Applications',
  type: 'document',
  fields: [
    {
      name: 'applicant',
      title: 'Applicant Information',
      type: 'object',
      fields: [
        {
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule: any) => Rule.required().email()
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'ssn',
          title: 'Social Security Number',
          type: 'string'
        },
        {
          name: 'dateOfBirth',
          title: 'Date of Birth',
          type: 'date'
        },
        {
          name: 'address',
          title: 'Address',
          type: 'object',
          fields: [
            {
              name: 'street',
              title: 'Street',
              type: 'string'
            },
            {
              name: 'city',
              title: 'City',
              type: 'string'
            },
            {
              name: 'postalCode',
              title: 'Postal Code',
              type: 'string'
            },
            {
              name: 'country',
              title: 'Country',
              type: 'string',
              initialValue: 'Finland'
            }
          ]
        }
      ]
    },
    {
      name: 'employment',
      title: 'Employment Information',
      type: 'object',
      fields: [
        {
          name: 'status',
          title: 'Employment Status',
          type: 'string',
          options: {
            list: [
              { title: 'Employed', value: 'employed' },
              { title: 'Self-Employed', value: 'self-employed' },
              { title: 'Student', value: 'student' },
              { title: 'Retired', value: 'retired' },
              { title: 'Unemployed', value: 'unemployed' }
            ]
          }
        },
        {
          name: 'employer',
          title: 'Employer',
          type: 'string'
        },
        {
          name: 'jobTitle',
          title: 'Job Title',
          type: 'string'
        },
        {
          name: 'monthlyIncome',
          title: 'Monthly Income (€)',
          type: 'number'
        },
        {
          name: 'employmentDuration',
          title: 'Employment Duration (months)',
          type: 'number'
        }
      ]
    },
    {
      name: 'loanDetails',
      title: 'Loan Details',
      type: 'object',
      fields: [
        {
          name: 'car',
          title: 'Car',
          type: 'reference',
          to: [{ type: 'car' }]
        },
        {
          name: 'vehiclePrice',
          title: 'Vehicle Price (€)',
          type: 'number',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'downPayment',
          title: 'Down Payment (€)',
          type: 'number',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'loanAmount',
          title: 'Loan Amount (€)',
          type: 'number',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'loanTerm',
          title: 'Loan Term (months)',
          type: 'number',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'preferredMonthlyPayment',
          title: 'Preferred Monthly Payment (€)',
          type: 'number'
        }
      ]
    },
    {
      name: 'status',
      title: 'Application Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Submitted', value: 'submitted' },
          { title: 'Under Review', value: 'under-review' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
          { title: 'Withdrawn', value: 'withdrawn' }
        ]
      },
      initialValue: 'draft'
    },
    {
      name: 'creditScore',
      title: 'Credit Score',
      type: 'number'
    },
    {
      name: 'approvalDetails',
      title: 'Approval Details',
      type: 'object',
      fields: [
        {
          name: 'approvedAmount',
          title: 'Approved Amount (€)',
          type: 'number'
        },
        {
          name: 'interestRate',
          title: 'Interest Rate (%)',
          type: 'number'
        },
        {
          name: 'monthlyPayment',
          title: 'Monthly Payment (€)',
          type: 'number'
        },
        {
          name: 'approvedDate',
          title: 'Approved Date',
          type: 'datetime'
        },
        {
          name: 'approvedBy',
          title: 'Approved By',
          type: 'reference',
          to: [{ type: 'user' }]
        }
      ]
    },
    {
      name: 'documents',
      title: 'Supporting Documents',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {
            accept: '.pdf,.doc,.docx,.jpg,.png'
          }
        }
      ]
    },
    {
      name: 'notes',
      title: 'Internal Notes',
      type: 'text'
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime'
    },
    {
      name: 'gdprConsent',
      title: 'GDPR Consent',
      type: 'boolean',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'creditCheckConsent',
      title: 'Credit Check Consent',
      type: 'boolean',
      validation: (Rule: any) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'applicant.lastName',
      subtitle: 'loanDetails.loanAmount',
      status: 'status'
    },
    prepare({ title, subtitle, status }: any) {
      return {
        title: `${title}`,
        subtitle: `€${subtitle} - ${status}`
      }
    }
  }
}