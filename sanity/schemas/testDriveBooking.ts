import { SanityRule } from './types';

const testDriveBookingSchema = {
  name: 'testDriveBooking',
  title: 'Test Drive Bookings',
  type: 'document',
  fields: [
    {
      name: 'customer',
      title: 'Customer',
      type: 'object',
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
          name: 'driversLicense',
          title: 'Drivers License Number',
          type: 'string'
        }
      ]
    },
    {
      name: 'car',
      title: 'Car',
      type: 'reference',
      to: [{ type: 'car' }],
      validation: (Rule: SanityRule) => Rule.required()
    },
    {
      name: 'scheduledDate',
      title: 'Scheduled Date',
      type: 'datetime',
      validation: (Rule: SanityRule) => Rule.required()
    },
    {
      name: 'preferredTime',
      title: 'Preferred Time',
      type: 'string',
      options: {
        list: [
          { title: 'Morning (9-12)', value: 'morning' },
          { title: 'Afternoon (12-16)', value: 'afternoon' },
          { title: 'Evening (16-19)', value: 'evening' }
        ]
      }
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'No Show', value: 'no-show' }
        ]
      },
      initialValue: 'pending'
    },
    {
      name: 'salesPerson',
      title: 'Assigned Sales Person',
      type: 'reference',
      to: [{ type: 'user' }]
    },
    {
      name: 'notes',
      title: 'Additional Notes',
      type: 'text'
    },
    {
      name: 'feedback',
      title: 'Customer Feedback',
      type: 'text'
    },
    {
      name: 'outcome',
      title: 'Outcome',
      type: 'string',
      options: {
        list: [
          { title: 'Purchase Intent', value: 'purchase-intent' },
          { title: 'Need More Time', value: 'need-time' },
          { title: 'Not Interested', value: 'not-interested' },
          { title: 'Interested in Different Car', value: 'different-car' }
        ]
      }
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'gdprConsent',
      title: 'GDPR Consent',
      type: 'boolean',
      validation: (Rule: SanityRule) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'customer.name',
      subtitle: 'scheduledDate',
      status: 'status'
    },
    prepare({ title, subtitle, status }: { title: string; subtitle: string; status: string }) {
      const date = new Date(subtitle).toLocaleDateString('fi-FI');
      return {
        title,
        subtitle: `${date} - ${status}`
      }
    }
  }
};

export default testDriveBookingSchema;