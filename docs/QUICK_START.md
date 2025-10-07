# Quick Start Guide

Get Kroi Auto Center running in production in under 30 minutes.

## Choose Your Path

### Path 1: Vercel (Easiest) - 10 minutes

**Best for:** Quick deployment, no DevOps experience needed

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Configure environment
cp .env.example .env.production
# Edit .env.production with your values

# 4. Deploy
vercel --prod

# Done! Your app is live
```

[→ Detailed Vercel Guide](./deployment/VERCEL.md)

### Path 2: Docker (Intermediate) - 20 minutes

**Best for:** Custom server, full control

```bash
# 1. Configure environment
cp .env.example .env.production
nano .env.production  # Add your secrets

# 2. Start production stack
docker-compose up -d

# 3. Verify health
curl http://localhost:3000/api/health

# 4. Setup SSL (Let's Encrypt)
sudo certbot --nginx -d yourdomain.com

# Done! Your app is running
```

[→ Detailed Docker Guide](./deployment/DOCKER.md)

### Path 3: AWS (Advanced) - 60 minutes

**Best for:** Enterprise scale, auto-scaling

See [AWS Deployment Guide](./deployment/AWS.md) for detailed instructions.

## Essential Configuration

### 1. Required Environment Variables

```env
# Email (Required for contact forms)
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=kroiautocenter@gmail.com

# Error Tracking (Required for production)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Analytics (Optional but recommended)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Get API Keys

**Resend (Email):**
1. Sign up: https://resend.com
2. Verify domain or use test domain
3. Create API key
4. Add to `.env.production`

**Sentry (Error Tracking):**
1. Sign up: https://sentry.io
2. Create Next.js project
3. Copy DSN
4. Add to `.env.production`

**Google Analytics (Optional):**
1. Create GA4 property: https://analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `.env.production`

## Testing Locally

```bash
# 1. Install dependencies
npm install

# 2. Setup local environment
cp .env.example .env.local
nano .env.local  # Add your keys

# 3. Start development database (optional)
npm run docker:dev

# 4. Run development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

## Verify Deployment

After deployment, check these:

```bash
# 1. Health check
curl https://yourdomain.com/api/health
# Expected: {"status":"healthy",...}

# 2. Homepage loads
curl https://yourdomain.com
# Expected: 200 OK

# 3. SSL certificate
curl -I https://yourdomain.com | grep "strict-transport-security"
# Expected: HSTS header present

# 4. Check Sentry
# Open Sentry dashboard
# Send test error to verify integration
```

## Common Issues

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

```bash
# Vercel: Check dashboard
vercel env ls

# Docker: Verify .env.production exists
cat .env.production

# Restart application
docker-compose restart app
```

### Database Connection Issues

```bash
# Verify database is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

## Monitoring Setup

### 1. Uptime Monitoring

Use any service:
- **UptimeRobot** (Free): https://uptimerobot.com
- **Pingdom**: https://www.pingdom.com
- **StatusCake**: https://www.statuscake.com

Add URL: `https://yourdomain.com/api/health`

### 2. Error Tracking

Already configured! Check Sentry dashboard:
- https://sentry.io/organizations/your-org/issues/

### 3. Performance Monitoring

Built-in via `/api/vitals` endpoint and Sentry performance monitoring.

## Backup Setup

### Automated Database Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/kroi-auto-center/scripts/backup/backup-database.sh production
```

### Manual Backup

```bash
npm run backup:db
```

## Next Steps

1. **[Read Infrastructure Guide](./INFRASTRUCTURE.md)** - Understand the full architecture
2. **[Review Security](./PRODUCTION_READY_CHECKLIST.md)** - Ensure all security measures in place
3. **[Setup Monitoring](./INFRASTRUCTURE.md#monitoring--observability)** - Configure alerts and dashboards
4. **[Plan Scaling](./INFRASTRUCTURE.md#scaling-strategy)** - Prepare for growth

## Support

- **Documentation**: `/docs` directory
- **Issues**: GitHub Issues
- **Email**: support@kroiautocenter.fi

## Deployment Checklist

Quick checklist before going live:

- [ ] Environment variables configured
- [ ] API keys working (test email send)
- [ ] Domain pointed to deployment
- [ ] SSL certificate active (HTTPS working)
- [ ] Health check passing
- [ ] Sentry receiving errors
- [ ] Analytics tracking
- [ ] Backup schedule configured
- [ ] Monitoring alerts setup
- [ ] Team notified

---

**Time to Production:** 10-60 minutes (depending on path chosen)

**Total Cost:** $0-100/month (depending on platform and traffic)