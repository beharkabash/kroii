# Key Files Reference

Quick reference for all integration-related files.

## 📧 Email Integration

### Core Files
- `/app/lib/email/resend-client.ts` - Resend API client
- `/app/lib/email/email-service.ts` - Email sending logic with retry
- `/app/lib/email/templates/contact-notification.tsx` - Business notification
- `/app/lib/email/templates/auto-responder.tsx` - Customer confirmation

## 🔗 API Endpoints

### Contact & Newsletter
- `/app/api/contact/route.ts` - Contact form endpoint
- `/app/api/newsletter/route.ts` - Newsletter subscription

## 📊 Analytics

### Google Analytics 4
- `/app/components/Analytics.tsx` - GA4 component
- `/app/lib/analytics.ts` - Event tracking utilities

## 🛡️ Security & Validation

### Input Validation & Security
- `/app/lib/validation.ts` - Zod schemas & sanitization
- `/app/lib/rate-limit.ts` - Rate limiting middleware
- `/app/lib/lead-scoring.ts` - Lead quality scoring

## 📖 Documentation

### Setup & Reference
- `/IMPLEMENTATION_SUMMARY.md` - Complete overview (this document)
- `/INTEGRATION_SETUP.md` - Step-by-step setup guide
- `/API_DOCUMENTATION.md` - API reference
- `/INTEGRATIONS_README.md` - Features & structure
- `/QUICK_REFERENCE.md` - Quick reference card
- `/.env.example` - Environment variables template

## ⚙️ Configuration

### Environment Variables
- `/.env.example` - Template with all variables
- `/.env.local` - Local development (create this, not in git)

### Package Configuration
- `/package.json` - Dependencies and scripts
- `/next.config.ts` - Next.js configuration

## 📁 File Count Summary

- **Source Code**: 10 files (~2,500 lines)
- **Documentation**: 6 files (~2,000 lines)
- **Templates**: 2 React email templates
- **API Endpoints**: 2 Next.js API routes
- **Utilities**: 5 helper libraries

## 🔍 Finding Files Quickly

### View all integration files:
```bash
ls -R app/lib/ app/api/ app/components/Analytics.tsx
```

### Search for specific functionality:
```bash
# Email service
grep -r "resend" app/lib/email/

# Analytics
grep -r "gtag" app/

# Validation
grep -r "zod" app/lib/

# Rate limiting
grep -r "rateLimit" app/
```

### Count lines of code:
```bash
# All integration code
find app/lib/ app/api/ app/components/Analytics.tsx -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Documentation
wc -l *.md
```

## 📝 Edit Priorities

If you need to customize, edit these files first:

1. **Email Templates**: `/app/lib/email/templates/*.tsx`
2. **Email Content**: `/app/lib/email/email-service.ts` (lines 170-194)
3. **Validation Rules**: `/app/lib/validation.ts`
4. **Rate Limits**: `/.env.local` (RATE_LIMIT_MAX_REQUESTS)
5. **Lead Scoring**: `/app/lib/lead-scoring.ts`

## 🎯 Key Functions

### Sending Emails
```typescript
import { sendContactNotification, sendAutoResponder } from '@/app/lib/email/email-service';
```

### Tracking Analytics
```typescript
import { trackCarView, trackWhatsAppClick, trackContactForm } from '@/app/lib/analytics';
```

### Validating Input
```typescript
import { contactFormSchema, newsletterSchema } from '@/app/lib/validation';
```

### Rate Limiting
```typescript
import { rateLimitForm, rateLimitAPI } from '@/app/lib/rate-limit';
```

### Lead Scoring
```typescript
import { calculateLeadScore } from '@/app/lib/lead-scoring';
```

---

**Last Updated**: 2025-09-27
