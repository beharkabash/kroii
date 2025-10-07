# Quick Reference Card - API Integrations

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local

# 3. Add API keys (see below)

# 4. Run development
npm run dev

# 5. Test at http://localhost:3000
```

---

## 🔑 API Keys Setup (5 minutes)

### Resend (Email)
1. Visit: https://resend.com
2. Sign up → API Keys → Create
3. Copy key → Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```

### Google Analytics
1. Visit: https://analytics.google.com
2. Create Property → Web Stream
3. Copy Measurement ID → Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

---

## 📧 Email Templates

### Contact Notification (to business)
- **File**: `/app/lib/email/templates/contact-notification.tsx`
- **Includes**: Lead score, customer info, quick actions
- **Sent to**: `CONTACT_EMAIL` env variable

### Auto-Responder (to customer)
- **File**: `/app/lib/email/templates/auto-responder.tsx`
- **Includes**: Confirmation, company info, call-to-actions
- **Sent to**: Customer's email

---

## 📊 Analytics Events

### Track in Code

```typescript
import { trackCarView, trackWhatsAppClick, trackContactForm } from '@/app/lib/analytics';

// Track car view
trackCarView({
  car_id: 'bmw-320d',
  car_name: 'BMW 320d 2020',
  car_price: '24990',
});

// Track WhatsApp click
trackWhatsAppClick('BMW 320d 2020');

// Track contact form
trackContactForm({
  car_interest: 'BMW 320d',
  lead_score: 85
});
```

### View in GA4
- **Realtime**: Reports → Realtime (instant)
- **Events**: Reports → Engagement → Events (24h delay)
- **Conversions**: Configure → Conversions

---

## 🛡️ API Endpoints

### POST /api/contact
```bash
curl -X POST https://kroiautocenter.fi/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Matti",
    "email": "matti@example.com",
    "message": "Interested in BMW"
  }'
```

### POST /api/newsletter
```bash
curl -X POST https://kroiautocenter.fi/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "matti@example.com"
  }'
```

---

## 🎯 Lead Scoring

| Factor | Points |
|--------|--------|
| Phone provided | +20 |
| Business email | +10 |
| Full name | +10 |
| Long message | +30 |
| Car interest | +30 |
| Urgent words | +10 |
| Buy intent | +10 |

**Quality Levels**:
- 🔥 High: 70-100 (priority)
- 🟡 Medium: 40-69 (standard)
- ⚪ Low: 0-39 (general)

---

## 🚦 Rate Limits

- **Contact Form**: 3/minute per IP
- **Newsletter**: 3/minute per IP
- **General API**: 30/minute per IP

**Change in `.env.local`:**
```bash
RATE_LIMIT_MAX_REQUESTS=5  # increase limit
```

---

## 🔍 Monitoring

### Email Delivery
- Dashboard: https://resend.com/emails
- Check: Delivery rate >95%, Bounce <2%

### Analytics
- Dashboard: https://analytics.google.com
- Check: Daily users, conversions, events

### Server Logs
```bash
# Local
npm run dev  # watch console

# Vercel
vercel logs
```

---

## ⚠️ Troubleshooting

### Emails not sending?
```bash
# Check API key
echo $RESEND_API_KEY

# Test with cURL
curl https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"onboarding@resend.dev","to":"test@test.com","subject":"Test","html":"Test"}'
```

### Analytics not tracking?
- Check Measurement ID format: `G-XXXXXXXXXX`
- Disable ad blockers
- Check GA4 Realtime (instant)
- Wait 24h for full events

### Rate limit too strict?
```bash
# Edit .env.local
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=120000  # 2 minutes
```

---

## 📁 File Locations

```
Key Files:
├── .env.example              # Environment template
├── INTEGRATIONS_README.md    # Full overview
├── INTEGRATION_SETUP.md      # Setup guide
├── API_DOCUMENTATION.md      # API reference
│
├── app/
│   ├── api/
│   │   ├── contact/route.ts         # Contact endpoint
│   │   └── newsletter/route.ts      # Newsletter endpoint
│   ├── lib/
│   │   ├── analytics.ts             # GA4 tracking
│   │   ├── validation.ts            # Input validation
│   │   ├── rate-limit.ts            # Rate limiting
│   │   ├── lead-scoring.ts          # Lead scoring
│   │   └── email/
│   │       ├── email-service.ts     # Email logic
│   │       └── templates/           # Email templates
│   └── components/
│       └── Analytics.tsx            # GA4 component
```

---

## 🔒 Security Checklist

Before production:
- [ ] `RESEND_API_KEY` set in Vercel
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] `.env` files not in Git
- [ ] Domain verified in Resend

---

## 💰 Costs

| Service | Free Tier | Current |
|---------|-----------|---------|
| Resend | 3,000 emails/mo | $0 |
| Google Analytics | Unlimited | $0 |
| Vercel | 100GB bandwidth | $0 |
| **Total** | | **$0/month** |

---

## 📞 Support

- **Email**: kroiautocenter@gmail.com
- **Phone**: +358 41 3188214
- **Docs**: See `/INTEGRATION_SETUP.md`

---

## 🎓 Learn More

- **Resend Docs**: https://resend.com/docs
- **GA4 Docs**: https://support.google.com/analytics
- **Zod Docs**: https://zod.dev
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Print this page for quick reference! 📄**

Last Updated: 2025-09-27