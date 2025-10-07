# Vercel Deployment Guide

Complete guide for deploying Kroi Auto Center to Vercel with production-ready configuration.

## Prerequisites

- GitHub account with repository access
- Vercel account (sign up at https://vercel.com)
- Environment variables configured

## Quick Deployment

### Option 1: Deploy via Vercel Dashboard

1. **Import Project**
   ```bash
   # Push code to GitHub
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "Next.js" framework preset
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Click "Save"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Environment Variables

Configure these in Vercel Dashboard under Project Settings → Environment Variables:

### Required Variables

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://kroiautocenter.fi

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@kroiautocenter.fi
CONTACT_EMAIL=kroiautocenter@gmail.com

# Monitoring (Sentry)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=your_auth_token
SENTRY_ORG=your_org
SENTRY_PROJECT=kroi-auto-center
SENTRY_TRACES_SAMPLE_RATE=0.1

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Security
ENABLE_RATE_LIMITING=true
RATE_LIMIT_MAX_REQUESTS=3
RATE_LIMIT_WINDOW_MS=60000
```

### Optional Variables (for advanced features)

```env
# Database (Vercel Postgres)
DATABASE_URL=postgres://...

# Redis (Upstash)
REDIS_URL=redis://...

# Authentication
NEXTAUTH_URL=https://kroiautocenter.fi
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
```

## Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain: `kroiautocenter.fi`
   - Add `www.kroiautocenter.fi`

2. **Configure DNS**

   Add these records to your DNS provider:

   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Automatic via Let's Encrypt
   - No configuration needed

## Build & Deployment Settings

### Build Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "devCommand": "npm run dev"
}
```

### Framework Preset

- **Framework**: Next.js
- **Node Version**: 20.x
- **Build Cache**: Enabled

## Performance Optimizations

### Enable Edge Runtime

For API routes, add:

```typescript
export const runtime = 'edge';
```

### Image Optimization

Vercel automatically optimizes images. Configure in `next.config.ts`:

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
}
```

## Monitoring Setup

### Vercel Analytics

1. Enable in Project Settings → Analytics
2. Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Vercel Speed Insights

1. Enable in Project Settings → Speed Insights
2. Add to `app/layout.tsx`:

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## CI/CD Integration

### GitHub Integration

Vercel automatically deploys:
- **Production**: Commits to `main` branch
- **Preview**: Pull requests

### Preview Deployments

Each PR gets a unique preview URL:
- `https://kroi-auto-center-git-feature-username.vercel.app`

### Deployment Protection

1. Go to Project Settings → Deployment Protection
2. Enable protection for production deployments
3. Add allowed email domains

## Rollback Strategy

### Quick Rollback

```bash
# Via CLI
vercel rollback <deployment-url>

# Via Dashboard
1. Go to Deployments
2. Find working deployment
3. Click "Promote to Production"
```

### Instant Rollback

Vercel keeps all deployments:
- Instant rollback to any previous deployment
- Zero downtime
- Automatic SSL certificate transfer

## Troubleshooting

### Build Failures

```bash
# Check build logs
vercel logs <deployment-url>

# Test build locally
npm run build
```

### Environment Variable Issues

```bash
# Verify variables are set
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

### DNS Issues

```bash
# Verify DNS configuration
nslookup kroiautocenter.fi

# Check Vercel DNS
dig kroiautocenter.fi
```

## Cost Optimization

### Vercel Pro Tips

1. **Use Edge Functions** - Faster, cheaper
2. **Enable ISR** - Reduce build times
3. **Optimize Images** - Use Vercel Image Optimization
4. **Prune Logs** - Keep only recent logs

### Monitoring Costs

- Dashboard: Usage → Current Period
- Set budget alerts
- Monitor bandwidth usage

## Security Best Practices

1. **Enable Vercel WAF** (Pro plan)
2. **Use Environment Variables** for secrets
3. **Enable DDoS Protection** (automatic)
4. **Configure Security Headers** (in next.config.ts)
5. **Enable HTTPS only** (automatic)

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Custom domain added and verified
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Sentry integration configured
- [ ] Build succeeds locally
- [ ] Preview deployment tested
- [ ] Production deployment successful
- [ ] Health check passing
- [ ] DNS propagated (24-48 hours)

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Support**: https://vercel.com/support
- **Status Page**: https://www.vercel-status.com

## Advanced Configuration

### Rewrites & Redirects

Configure in `next.config.ts`:

```typescript
async redirects() {
  return [
    {
      source: '/old-path',
      destination: '/new-path',
      permanent: true,
    },
  ];
},
```

### Middleware

Create `middleware.ts` for edge processing:

```typescript
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  // Add custom logic
  return NextResponse.next();
}
```

### Cron Jobs (Pro plan)

Configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```