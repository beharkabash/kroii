# Production Deployment Checklist - Kroi Auto Center

This document provides a comprehensive checklist for deploying the Kroi Auto Center application to production.

## Pre-Deployment Checklist

### 1. Environment Configuration

#### Required Environment Variables
- [ ] `RESEND_API_KEY` - Email service API key (Get from https://resend.com)
- [ ] `CONTACT_EMAIL` - Business email for receiving contact form submissions
- [ ] `FROM_EMAIL` - Sender email for automated emails
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID (optional but recommended)

#### Optional Environment Variables
- [ ] `RATE_LIMIT_MAX_REQUESTS` - Max form submissions per window (default: 3)
- [ ] `RATE_LIMIT_WINDOW_MS` - Rate limit time window in ms (default: 60000)
- [ ] `ENABLE_RATE_LIMITING` - Enable/disable rate limiting (default: true)

### 2. Email Service Setup (Resend)

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create an account (Free tier: 3,000 emails/month, 100 emails/day)

2. **Domain Verification** (Recommended for production)
   - Add your domain (kroiautocenter.fi) in Resend dashboard
   - Add DNS records to your domain provider:
     - TXT record for domain verification
     - MX records for email receiving
     - DKIM records for email authentication
   - Wait for verification (can take up to 48 hours)

3. **Get API Key**
   - Go to Resend dashboard > API Keys
   - Create a new API key
   - Copy the key (starts with `re_`)
   - Add to environment variables: `RESEND_API_KEY=re_xxxxxxxxxx`

4. **Update Email Addresses**
   - Set `FROM_EMAIL=noreply@kroiautocenter.fi` (use verified domain)
   - Set `CONTACT_EMAIL=kroiautocenter@gmail.com`

### 3. Google Analytics Setup (Optional)

1. **Create GA4 Property**
   - Go to https://analytics.google.com
   - Create a new GA4 property or use existing one
   - Go to Admin > Data Streams > Web
   - Copy the Measurement ID (format: G-XXXXXXXXXX)

2. **Add to Environment**
   - Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

### 4. Code Quality Checks

- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Run ESLint: `npm run lint`
- [ ] Test production build locally: `npm run build && npm start`
- [ ] Check all pages load without errors
- [ ] Test contact form submission
- [ ] Verify email delivery (if configured)

### 5. Performance Optimization

- [ ] Images optimized and in WebP/AVIF format
- [ ] Unused dependencies removed
- [ ] Bundle size analyzed: `npm run build:analyze`
- [ ] Service worker registered for offline support
- [ ] Critical CSS inlined

### 6. SEO Configuration

- [x] Dynamic sitemap.xml generated (includes all car pages)
- [x] robots.txt configured
- [x] Structured data (Schema.org) added for:
  - [x] AutoDealer (homepage)
  - [x] Car listings (individual car pages)
- [x] Meta tags configured for all pages
- [x] Open Graph tags for social sharing
- [x] Twitter Card tags

### 7. Security Checks

- [x] Rate limiting enabled for API endpoints
- [x] Input validation with Zod schemas
- [x] XSS protection (input sanitization)
- [x] CSRF protection (Next.js built-in)
- [ ] HTTPS enforced (configure on hosting platform)
- [ ] Security headers configured
- [ ] Environment variables not exposed to client

### 8. Error Handling

- [x] Global error boundary implemented
- [x] API error responses standardized
- [x] 404 page configured
- [x] Loading states for all async operations
- [x] Graceful fallbacks for failed requests

## Deployment Instructions

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications with zero configuration.

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub** (Recommended)
   - Push code to GitHub repository
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables
   - Click "Deploy"

3. **Deploy via CLI**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add all required environment variables
   - Redeploy the application

5. **Configure Domain**
   - Go to Project Settings > Domains
   - Add custom domain: kroiautocenter.fi
   - Update DNS records at your domain provider
   - Wait for SSL certificate provisioning

### Option 2: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t kroi-auto-center .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e RESEND_API_KEY=re_xxxxxxxxxx \
     -e CONTACT_EMAIL=kroiautocenter@gmail.com \
     -e FROM_EMAIL=noreply@kroiautocenter.fi \
     -e NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
     kroi-auto-center
   ```

3. **Deploy to Cloud**
   - Push image to container registry (Docker Hub, GCP, AWS ECR)
   - Deploy to Kubernetes, Google Cloud Run, AWS ECS, etc.

### Option 3: Traditional VPS (Ubuntu/Debian)

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/kroi-auto-center.git
   cd kroi-auto-center
   ```

3. **Install Dependencies**
   ```bash
   npm ci --production
   ```

4. **Set Environment Variables**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "kroi-auto-center" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name kroiautocenter.fi www.kroiautocenter.fi;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d kroiautocenter.fi -d www.kroiautocenter.fi
   ```

## Post-Deployment Verification

### 1. Functionality Testing
- [ ] Homepage loads correctly
- [ ] All car detail pages accessible
- [ ] Navigation works (desktop and mobile)
- [ ] Contact form submission works
- [ ] WhatsApp links work
- [ ] Phone links work (on mobile)
- [ ] Social sharing works

### 2. Email Testing
- [ ] Contact form sends email to business
- [ ] Auto-responder sent to customer
- [ ] Emails arrive in inbox (not spam)
- [ ] Email content displays correctly

### 3. Performance Testing
- [ ] Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.9s
- [ ] Total Blocking Time < 300ms

### 4. SEO Verification
- [ ] sitemap.xml accessible: https://kroiautocenter.fi/sitemap.xml
- [ ] robots.txt accessible: https://kroiautocenter.fi/robots.txt
- [ ] All pages indexed by Google (use Google Search Console)
- [ ] Structured data valid (test with Google Rich Results Test)
- [ ] Meta tags correct (test with Facebook Debugger, Twitter Card Validator)

### 5. Security Testing
- [ ] HTTPS works and redirects HTTP
- [ ] SSL certificate valid
- [ ] Security headers present (CSP, X-Frame-Options, etc.)
- [ ] Rate limiting works (try multiple form submissions)
- [ ] XSS protection works (try malicious inputs)

### 6. Mobile Testing
- [ ] Responsive design works on all screen sizes
- [ ] Touch targets are at least 48x48px
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling
- [ ] PWA installable

### 7. Analytics Verification
- [ ] Google Analytics tracking works
- [ ] Page views recorded
- [ ] Events tracked (form submissions, clicks)
- [ ] Real-time data visible in GA dashboard

## Monitoring & Maintenance

### Setup Monitoring (Recommended)

1. **Uptime Monitoring**
   - UptimeRobot (free): https://uptimerobot.com
   - Pingdom
   - StatusCake

2. **Error Tracking**
   - Sentry (recommended): https://sentry.io
   - Rollbar
   - LogRocket

3. **Performance Monitoring**
   - Google PageSpeed Insights
   - WebPageTest
   - Vercel Analytics (if using Vercel)

### Regular Maintenance Tasks

- [ ] Weekly: Check uptime and error logs
- [ ] Weekly: Review Google Analytics data
- [ ] Monthly: Update dependencies: `npm update`
- [ ] Monthly: Review and rotate API keys
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance optimization review

## Rollback Plan

If deployment fails or issues occur:

1. **Vercel**: Instantly revert to previous deployment
   - Go to Deployments tab
   - Click on previous successful deployment
   - Click "Promote to Production"

2. **Docker/VPS**: Rollback to previous version
   ```bash
   git checkout <previous-commit>
   npm run build
   pm2 restart kroi-auto-center
   ```

3. **Emergency Contact**
   - Keep backup of contact form submissions
   - Have phone number ready for critical issues
   - Document all deployment changes

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Resend Documentation**: https://resend.com/docs
- **Google Analytics**: https://analytics.google.com

## Troubleshooting

### Common Issues

**Emails not sending:**
- Check RESEND_API_KEY is correct
- Verify domain is verified in Resend
- Check FROM_EMAIL uses verified domain
- Review Resend logs for errors

**Analytics not tracking:**
- Verify NEXT_PUBLIC_GA_MEASUREMENT_ID is correct
- Check browser console for errors
- Verify GA4 property is active
- Wait 24-48 hours for data to appear

**Build fails:**
- Run `npm run build` locally
- Check TypeScript errors: `npx tsc --noEmit`
- Check ESLint errors: `npm run lint`
- Verify all dependencies installed

**Rate limiting too strict:**
- Adjust RATE_LIMIT_MAX_REQUESTS
- Increase RATE_LIMIT_WINDOW_MS
- Temporarily disable: ENABLE_RATE_LIMITING=false

---

**Last Updated**: 2025-01-27
**Version**: 1.0
**Status**: Production Ready