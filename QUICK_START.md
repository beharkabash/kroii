# Quick Start Guide - Kroi Auto Center

Get your application running in production in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Resend account (free tier available)
- (Optional) Google Analytics 4 property

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/your-username/kroi-auto-center.git
cd kroi-auto-center

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

## Step 2: Configure Email Service (3 minutes)

### Get Resend API Key

1. Go to https://resend.com and sign up (free tier: 3,000 emails/month)
2. Go to **API Keys** in the dashboard
3. Click **Create API Key**
4. Copy the key (starts with `re_`)

### Add to Environment

Edit `.env.local`:

```bash
RESEND_API_KEY=re_your_actual_key_here
FROM_EMAIL=noreply@kroiautocenter.fi
CONTACT_EMAIL=kroiautocenter@gmail.com
```

## Step 3: Test Locally (2 minutes)

```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test the contact form
```

## Step 4: Deploy to Vercel (3 minutes)

### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com and sign in
3. Click **Import Project**
4. Select your repository
5. Add environment variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_EMAIL`: kroiautocenter@gmail.com
   - `FROM_EMAIL`: noreply@kroiautocenter.fi
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: (optional) Your GA4 ID
6. Click **Deploy**

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
# Add environment variables when asked
```

## Step 5: Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click **Settings** > **Domains**
3. Add your domain: `kroiautocenter.fi`
4. Update DNS records at your domain registrar
5. Wait for SSL certificate provisioning (automatic)

## That's It!

Your application is now live in production with:

- ✅ Working contact form with email notifications
- ✅ SEO-optimized pages with structured data
- ✅ Dynamic sitemap generation
- ✅ Error handling and loading states
- ✅ Rate limiting and security headers
- ✅ Performance optimizations
- ✅ HTTPS with automatic SSL

## Next Steps

### 1. Verify Domain for Emails (Recommended)

To avoid emails going to spam:

1. Go to Resend dashboard > **Domains**
2. Click **Add Domain** > Enter `kroiautocenter.fi`
3. Add the provided DNS records to your domain:
   - TXT record for verification
   - MX records for receiving
   - DKIM records for authentication
4. Wait for verification (24-48 hours)
5. Update `FROM_EMAIL=noreply@kroiautocenter.fi` in Vercel

### 2. Setup Google Analytics (Optional)

1. Go to https://analytics.google.com
2. Create a GA4 property
3. Copy the Measurement ID (G-XXXXXXXXXX)
4. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
5. Redeploy the application

### 3. Submit to Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: `kroiautocenter.fi`
3. Verify ownership (via DNS or HTML file)
4. Submit sitemap: `https://kroiautocenter.fi/sitemap.xml`

### 4. Monitor Your Application

- **Vercel Dashboard**: Monitor deployments and performance
- **Resend Dashboard**: Track email delivery
- **Google Analytics**: Track user behavior
- **UptimeRobot** (free): Set up uptime monitoring

## Troubleshooting

### Emails Not Sending

```bash
# Check environment variable is set
echo $RESEND_API_KEY

# Test with curl
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@kroiautocenter.fi",
    "to": "test@example.com",
    "subject": "Test",
    "text": "Test email"
  }'
```

If you get an error:
- Verify API key is correct
- Check FROM_EMAIL domain is verified in Resend
- Review Resend logs for delivery issues

### Build Fails

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint

# Try building locally
npm run build
```

### 404 on Car Pages

Make sure you're using the correct URL format:
- ✅ `https://kroiautocenter.fi/cars/bmw-318-2017`
- ❌ `https://kroiautocenter.fi/cars/1`

## Support

- **Documentation**: See `PRODUCTION_CHECKLIST.md` for detailed guide
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Resend Docs**: https://resend.com/docs

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run linting
npm run lint

# Analyze bundle size
npm run build:analyze
```

## File Structure

```
kroi-auto-center/
├── app/
│   ├── api/              # API routes (contact, newsletter)
│   ├── cars/             # Car detail pages
│   ├── components/       # Reusable components
│   ├── data/             # Car data
│   ├── lib/              # Utilities and services
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   ├── error.tsx         # Error boundary
│   ├── loading.tsx       # Loading state
│   ├── sitemap.ts        # Dynamic sitemap
│   └── robots.ts         # Robots.txt
├── public/               # Static assets
├── .env.example          # Environment template
├── next.config.ts        # Next.js configuration
└── package.json          # Dependencies
```

---

**Need Help?** Check the detailed `PRODUCTION_CHECKLIST.md` or open an issue on GitHub.