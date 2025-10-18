import { SanityRule } from './types';

const leadSchema = {
  name: 'lead',
  title: 'Leads',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: SanityRule) => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: SanityRule) => Rule.required().email()
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (Rule: SanityRule) => Rule.required()
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text'
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Contact Form', value: 'contact' },
          { title: 'Test Drive', value: 'test-drive' },
          { title: 'Financing', value: 'financing' },
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Trade In', value: 'trade-in' }
        ]
      },
      initialValue: 'contact'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Converted', value: 'converted' },
          { title: 'Lost', value: 'lost' }
        ]
      },
      initialValue: 'new'
    },
    {
      name: 'carInterest',
      title: 'Car Interest',
      type: 'reference',
      to: [{ type: 'car' }]
    },
    {
      name: 'assignedTo',
      title: 'Assigned To',
      type: 'reference',
      to: [{ type: 'user' }]
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
      name: 'contactedAt',
      title: 'Last Contacted',
      type: 'datetime'
    },
    {
      name: 'gdprConsent',
      title: 'GDPR Consent',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'marketingConsent',
      title: 'Marketing Consent',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      status: 'status'
    },
    prepare({ title, subtitle, status }: { title: string; subtitle: string; status: string }) {
      return {
        title,
        subtitle: `${subtitle} - ${status}`
      }
    }
  }
};

export default leadSchema;