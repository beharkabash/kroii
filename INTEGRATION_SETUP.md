# Integration Setup Guide

Step-by-step guide to configure all API integrations for Kroi Auto Center.

## Prerequisites

- Node.js 18+ installed
- Access to your hosting platform (Vercel recommended)
- Access to your domain's DNS settings

---

## 1. Email Service Setup (Resend)

### Why Resend?

- **Free tier**: 3,000 emails/month (plenty for contact forms)
- **Easy setup**: No complex configuration
- **Great deliverability**: High inbox placement rate
- **Modern API**: Simple, well-documented
- **Real-time tracking**: Monitor delivery and opens

### Step-by-Step Setup

#### A. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Get Started" and sign up
3. Verify your email address

#### B. Get API Key (Quick Start)

**Option 1: Use Test Domain (Immediate)**
1. Go to Dashboard → API Keys
2. Click "Create API Key"
3. Name it: `Kroi Auto Center - Production`
4. Copy the API key (starts with `re_`)
5. **IMPORTANT**: Save it immediately (you can't see it again!)

With test domain, you can send to verified email addresses only.

**Option 2: Verify Your Domain (Recommended)**

1. Go to Dashboard → Domains
2. Click "Add Domain"
3. Enter: `kroiautocenter.fi`
4. You'll receive DNS records to add:

```
Type: TXT
Name: @
Value: resend-verify=xxx...xxx
TTL: 3600

Type: MX
Name: @
Value: feedback-smtp.eu-west-1.amazonses.com
Priority: 10
TTL: 3600
```

5. Add these records to your domain provider (Namecheap, GoDaddy, etc.)
6. Wait 15 minutes to 48 hours for verification
7. Once verified, create your API key as above

#### C. Configure Environment Variables

**Local Development:**
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add:
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=noreply@kroiautocenter.fi  # or onboarding@resend.dev for test
CONTACT_EMAIL=kroiautocenter@gmail.com
```

**Production (Vercel):**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add these variables:
   - `RESEND_API_KEY` = `re_your_actual_api_key`
   - `FROM_EMAIL` = `noreply@kroiautocenter.fi`
   - `CONTACT_EMAIL` = `kroiautocenter@gmail.com`
4. Redeploy your application

#### D. Test Email Delivery

```bash
# Run development server
npm run dev

# Submit a test contact form on http://localhost:3000
# Check your email and Resend dashboard for delivery
```

#### E. Verify in Resend Dashboard

1. Go to Dashboard → Logs
2. You should see your test email
3. Check status: ✓ Delivered
4. Monitor bounce rate and opens

---

## 2. Google Analytics 4 Setup

### Why Google Analytics?

- **Free forever**: No costs, unlimited events
- **Industry standard**: Best analytics tool available
- **Rich insights**: Understand user behavior
- **Conversion tracking**: Measure success
- **Privacy compliant**: GDPR-friendly settings

### Step-by-Step Setup

#### A. Create GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Sign in with Google account
3. Click "Admin" (gear icon, bottom left)
4. Click "Create Property"
5. Fill in:
   - Property name: `Kroi Auto Center`
   - Timezone: `(GMT+02:00) Helsinki`
   - Currency: `Euro (EUR)`
6. Click "Next"
7. Fill in business details:
   - Industry: `Automotive`
   - Business size: `Small`
8. Click "Create"
9. Accept Terms of Service

#### B. Create Data Stream

1. After property creation, you'll see "Set up data stream"
2. Click "Web"
3. Fill in:
   - Website URL: `https://kroiautocenter.fi`
   - Stream name: `Kroi Auto Center Website`
   - Enable all "Enhanced measurement" toggles
4. Click "Create stream"

#### C. Get Measurement ID

1. You'll see stream details
2. Find **Measurement ID** (format: `G-XXXXXXXXXX`)
3. Copy this ID

#### D. Configure Environment Variables

**Local Development:**
```bash
# Edit .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Production (Vercel):**
1. Settings → Environment Variables
2. Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
3. Redeploy

#### E. Verify Tracking

1. Start development server: `npm run dev`
2. Open http://localhost:3000
3. Go to GA4 → Reports → Realtime
4. You should see yourself as an active user!
5. Navigate around the site and watch events appear

#### F. Configure Custom Events

Our custom events are already configured in code:
- ✅ `car_view` - Car listing views
- ✅ `contact_form_submit` - Form submissions
- ✅ `whatsapp_click` - WhatsApp button clicks
- ✅ `phone_click` - Phone link clicks
- ✅ `newsletter_signup` - Newsletter subscriptions

**View Custom Events:**
1. GA4 → Configure → Events
2. Wait 24-48 hours for events to appear
3. Click on event name to see parameters

#### G. Set Up Conversions

1. GA4 → Configure → Conversions
2. Click "New conversion event"
3. Add these events as conversions:
   - `generate_lead`
   - `contact_form_submit`
   - `phone_click`
4. These now count as conversions in reports!

#### H. Create Useful Reports

**1. Lead Quality Report:**
1. Go to Reports → Engagement → Events
2. Click `contact_form_submit`
3. Add secondary dimension: `lead_score`
4. Save to library

**2. Car Interest Report:**
1. Events → `car_view`
2. Secondary dimension: `car_name`
3. See which cars get most views

**3. Contact Method Report:**
1. Events → `generate_lead`
2. Secondary dimension: `method`
3. See whether users prefer form, WhatsApp, or phone

---

## 3. WhatsApp Integration

Already configured! The button links to WhatsApp Business number.

### Optimize WhatsApp

**A. Enable WhatsApp Business:**
1. Download WhatsApp Business app
2. Register: +358 41 3188214
3. Set business profile:
   - Name: Kroi Auto Center
   - Category: Automotive
   - Hours: MA-PE 10-18, LA 11-17
4. Add greeting message
5. Add away message (outside hours)

**B. Quick Reply Templates:**
Create these templates in WhatsApp Business:
```
/greeting - Hei! Kiitos yhteydenotosta Kroi Auto Centeriin. Miten voin auttaa?
/hours - Olemme avoinna MA-PE 10-18, LA 11-17. Palaamme viestiin aukioloaikoina!
/visit - Osoitteemme: Läkkisepäntie 15 B 300620, Helsinki. Soita ennen tuloa!
/finance - Tarjoamme joustavia rahoitusratkaisuja. Kerro budjettisi, niin etsitään paras vaihtoehto!
```

---

## 4. Rate Limiting Configuration

Already implemented! But you can customize:

### Adjust Limits

Edit `.env.local`:
```bash
# More strict (recommended for small business)
RATE_LIMIT_MAX_REQUESTS=3
RATE_LIMIT_WINDOW_MS=60000  # 1 minute

# More lenient (if you get legitimate traffic)
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=60000

# Disable (not recommended)
ENABLE_RATE_LIMITING=false
```

### Monitor Rate Limiting

Check server logs for:
```
[RATE LIMIT] IP blocked: x.x.x.x
[RATE LIMIT] Suspicious activity detected
```

---

## 5. Security Checklist

### Before Going Live

- [ ] RESEND_API_KEY set in production
- [ ] FROM_EMAIL uses verified domain
- [ ] CONTACT_EMAIL goes to monitored inbox
- [ ] GA_MEASUREMENT_ID is correct
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Environment variables are not in Git
- [ ] `.env` files are in `.gitignore`
- [ ] API keys are production keys (not test)
- [ ] Error messages don't expose internals
- [ ] Logging doesn't contain sensitive data

### Security Best Practices

1. **Rotate API keys every 90 days**
   ```bash
   # Set reminder
   echo "Rotate Resend API key" | at now + 90 days
   ```

2. **Monitor API usage**
   - Check Resend dashboard weekly
   - Check GA4 for unusual spikes
   - Review server logs for errors

3. **Set up alerts**
   - Resend: Enable email alerts for bounces
   - Vercel: Enable deployment notifications
   - GA4: Set up anomaly detection

4. **Backup configuration**
   ```bash
   # Document current settings
   echo "RESEND_API_KEY=re_xxx" > .env.backup.txt.gpg
   gpg -c .env.backup.txt
   ```

---

## 6. Testing Checklist

### Email Testing

- [ ] Contact form sends email to business
- [ ] Auto-responder sends to customer
- [ ] Newsletter confirmation works
- [ ] Emails don't go to spam (check Resend SPF/DKIM)
- [ ] Email templates look good in Gmail, Outlook, Apple Mail
- [ ] Unsubscribe link works (if added)
- [ ] Reply-to address is correct

### Analytics Testing

- [ ] Page views are tracked
- [ ] Car views are tracked with correct parameters
- [ ] Contact form submissions trigger `generate_lead`
- [ ] WhatsApp clicks are tracked
- [ ] Phone clicks are tracked
- [ ] Events appear in GA4 Realtime (within 30 seconds)
- [ ] Custom parameters are captured
- [ ] Conversions are counted

### Form Testing

- [ ] Valid submissions work
- [ ] Invalid emails are rejected
- [ ] Short messages are rejected
- [ ] XSS attempts are blocked
- [ ] Rate limiting kicks in after 3 requests
- [ ] Error messages are user-friendly
- [ ] Success messages appear
- [ ] Form clears after submission

---

## 7. Monitoring & Maintenance

### Daily Checks

- Check email in CONTACT_EMAIL inbox
- Respond to contact forms within 24 hours
- Reply to WhatsApp messages during business hours

### Weekly Checks

- Review Resend dashboard for email delivery issues
- Check GA4 for traffic trends
- Review server logs for errors

### Monthly Checks

- Review lead quality scores
- Analyze which cars get most interest
- Check email bounce rates
- Review and update email templates if needed
- Check for npm package updates: `npm outdated`

### Quarterly Checks

- Rotate API keys
- Review and update analytics goals
- Analyze conversion funnel
- Update email templates based on performance
- Review security logs

---

## 8. Troubleshooting

### Emails Not Sending

**Problem**: Contact form submits but no emails arrive

**Solutions**:
1. Check environment variable: `echo $RESEND_API_KEY`
2. Verify API key is correct in Resend dashboard
3. Check Resend logs for errors
4. Ensure `FROM_EMAIL` domain is verified
5. Check server logs: `vercel logs` or local console
6. Test API key with cURL:
   ```bash
   curl https://api.resend.com/emails \
     -H "Authorization: Bearer $RESEND_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"from":"onboarding@resend.dev","to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
   ```

### Analytics Not Tracking

**Problem**: GA4 shows no data

**Solutions**:
1. Verify Measurement ID format: `G-XXXXXXXXXX`
2. Check browser console for errors
3. Disable ad blockers
4. Wait 24 hours (processing delay)
5. Check GA4 Realtime reports (instant)
6. Verify `next/script` is loading Google tag
7. Check CSP headers aren't blocking scripts

### Rate Limiting Too Strict

**Problem**: Legitimate users being blocked

**Solutions**:
1. Increase `RATE_LIMIT_MAX_REQUESTS` to 5
2. Increase `RATE_LIMIT_WINDOW_MS` to 120000 (2 minutes)
3. Check server logs for blocking patterns
4. Consider using Redis for distributed rate limiting
5. Implement IP whitelist for trusted addresses

### Forms Failing Validation

**Problem**: Valid forms being rejected

**Solutions**:
1. Check browser console for validation errors
2. Review Zod schema requirements
3. Test edge cases (accented characters, long names)
4. Verify regex patterns allow Finnish characters
5. Check maximum length limits

---

## 9. Advanced Configuration

### Using Redis for Rate Limiting

For high-traffic sites, replace in-memory rate limiting:

```typescript
// lib/rate-limit-redis.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function rateLimitRedis(identifier: string) {
  const key = `rate-limit:${identifier}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60); // 60 seconds
  }

  return {
    success: count <= 3,
    limit: 3,
    remaining: Math.max(0, 3 - count),
  };
}
```

### Database Integration

Store contact form submissions:

```typescript
// lib/database.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveContactForm(data: ContactFormData) {
  const { error } = await supabase
    .from('contacts')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      car_interest: data.carInterest,
      lead_score: data.leadScore,
      created_at: new Date().toISOString(),
    });

  if (error) throw error;
}
```

### CRM Integration

Sync leads to HubSpot:

```typescript
// lib/hubspot.ts
export async function createHubSpotContact(data: ContactFormData) {
  const response = await fetch(
    'https://api.hubapi.com/crm/v3/objects/contacts',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email: data.email,
          firstname: data.name.split(' ')[0],
          lastname: data.name.split(' ').slice(1).join(' '),
          phone: data.phone,
          message: data.message,
          hs_lead_status: data.leadScore >= 70 ? 'NEW' : 'OPEN',
        },
      }),
    }
  );

  if (!response.ok) throw new Error('HubSpot sync failed');
}
```

---

## Support

Need help with setup?

- **Email**: kroiautocenter@gmail.com
- **Phone**: +358 41 3188214
- **Documentation**: See `/API_DOCUMENTATION.md`

---

**Last Updated**: 2025-09-27