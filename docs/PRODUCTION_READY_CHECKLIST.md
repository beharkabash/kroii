# Production-Ready Deployment Checklist

Complete checklist to ensure Kroi Auto Center is production-ready before deployment.

## Pre-Deployment Checklist

### 1. Code Quality

- [ ] All TypeScript errors resolved (`npm run build`)
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented
- [ ] Code review completed
- [ ] Unit tests passing (if applicable)
- [ ] E2E tests passing (`npm run test`)

### 2. Environment Configuration

- [ ] `.env.production` created and configured
- [ ] All required environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `NEXT_PUBLIC_SITE_URL` (correct production URL)
  - [ ] `RESEND_API_KEY` (email service)
  - [ ] `SENTRY_DSN` (error tracking)
  - [ ] `DATABASE_URL` (if using database)
  - [ ] `REDIS_URL` (if using cache)
  - [ ] `NEXTAUTH_SECRET` (if using auth)
- [ ] No sensitive data in source code
- [ ] `.env` files added to `.gitignore`
- [ ] Environment variables documented in `.env.example`

### 3. Security

- [ ] HTTPS/SSL certificate configured
- [ ] Security headers enabled (check `next.config.ts`)
- [ ] CSP (Content Security Policy) configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled
- [ ] Dependencies vulnerability scan passed (`npm audit`)
- [ ] No exposed API keys or secrets
- [ ] Authentication/authorization implemented (if needed)
- [ ] Session management secure (if applicable)

### 4. Performance

- [ ] Images optimized (WebP/AVIF format)
- [ ] Static assets compressed (gzip/brotli)
- [ ] Bundle size within budget (< 5MB)
- [ ] Lighthouse score > 90 (Performance)
- [ ] Core Web Vitals passing:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Database queries optimized (indexes added)
- [ ] CDN configured for static assets
- [ ] Caching strategy implemented
- [ ] Lazy loading for images
- [ ] Code splitting enabled

### 5. Monitoring & Logging

- [ ] Sentry integration configured
- [ ] Error tracking tested
- [ ] Performance monitoring enabled
- [ ] Health check endpoint working (`/api/health`)
- [ ] Uptime monitoring configured
- [ ] Log aggregation setup
- [ ] Analytics integrated (Google Analytics)
- [ ] Alerts configured for critical errors
- [ ] Dashboard created for monitoring

### 6. Database

- [ ] Database migrations tested
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Backup strategy implemented
- [ ] Backup restoration tested
- [ ] Database credentials secured
- [ ] Query performance optimized
- [ ] Data validation implemented

### 7. Infrastructure

- [ ] Deployment platform chosen (Vercel/AWS/Docker)
- [ ] Infrastructure documented
- [ ] Scaling strategy defined
- [ ] Load balancer configured (if needed)
- [ ] Auto-scaling enabled (if applicable)
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure tested
- [ ] DNS configured correctly
- [ ] Domain SSL verified

### 8. CI/CD

- [ ] GitHub Actions workflows configured
- [ ] Automated tests in pipeline
- [ ] Security scanning enabled
- [ ] Automated deployments working
- [ ] Preview deployments for PRs
- [ ] Production deployment gated
- [ ] Rollback capability tested
- [ ] Build artifacts stored

### 9. Documentation

- [ ] Deployment guide created
- [ ] Environment setup documented
- [ ] API documentation (if applicable)
- [ ] Architecture diagram created
- [ ] Troubleshooting guide written
- [ ] Runbook for common operations
- [ ] Contact information updated
- [ ] License information included

### 10. Legal & Compliance

- [ ] Privacy policy added
- [ ] Terms of service created
- [ ] Cookie consent implemented (if needed)
- [ ] GDPR compliance (if applicable)
- [ ] Accessibility standards met (WCAG 2.1)
- [ ] Copyright notices included
- [ ] Third-party licenses documented

## Deployment Steps

### Phase 1: Pre-Deployment (1-2 days before)

```bash
# 1. Final code review
git checkout main
git pull origin main

# 2. Run all checks
npm run lint
npm run build
npm run test

# 3. Security audit
npm audit
npm run security:audit

# 4. Create deployment branch
git checkout -b deploy/production-$(date +%Y%m%d)

# 5. Update version
npm version patch
git push origin deploy/production-$(date +%Y%m%d)

# 6. Create release PR
# Review and merge to main
```

### Phase 2: Deployment (Deployment Day)

**For Vercel:**
```bash
# 1. Push to main (triggers auto-deploy)
git push origin main

# 2. Monitor deployment
vercel --prod

# 3. Verify deployment
curl https://kroiautocenter.fi/api/health
```

**For Docker:**
```bash
# 1. Build production image
docker build -t kroi-auto-center:v1.0.0 .

# 2. Tag and push to registry
docker tag kroi-auto-center:v1.0.0 ghcr.io/yourusername/kroi-auto-center:v1.0.0
docker push ghcr.io/yourusername/kroi-auto-center:v1.0.0

# 3. Deploy to server
ssh user@server
cd /opt/kroi-auto-center
git pull
docker-compose pull
docker-compose up -d

# 4. Verify health
curl https://kroiautocenter.fi/api/health
```

**For AWS:**
```bash
# 1. Push image to ECR
aws ecr get-login-password | docker login ...
docker push 123456789.dkr.ecr.eu-north-1.amazonaws.com/kroi:v1.0.0

# 2. Update ECS service
aws ecs update-service \
  --cluster kroi-cluster \
  --service kroi-service \
  --force-new-deployment

# 3. Monitor deployment
aws ecs describe-services --cluster kroi-cluster --services kroi-service

# 4. Verify health
curl https://kroiautocenter.fi/api/health
```

### Phase 3: Post-Deployment (Immediately After)

```bash
# 1. Smoke tests
curl https://kroiautocenter.fi
curl https://kroiautocenter.fi/api/health
curl https://kroiautocenter.fi/cars

# 2. Check error tracking
# Open Sentry dashboard
# Verify no critical errors

# 3. Monitor performance
# Check response times
# Verify Core Web Vitals

# 4. Check logs
docker-compose logs -f app
# or
vercel logs
# or
aws logs tail /ecs/kroi-auto-center --follow

# 5. Verify monitoring
# Check uptime monitoring
# Verify alerts working

# 6. Database health
# Check connections
# Verify queries working

# 7. Create deployment announcement
# Notify team
# Update status page
```

### Phase 4: Post-Deployment (24 hours)

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify backup ran successfully
- [ ] Review logs for anomalies
- [ ] Check uptime monitoring
- [ ] Verify analytics tracking
- [ ] Test all critical user flows
- [ ] Review user feedback
- [ ] Update documentation if needed

## Verification Commands

### Health Check
```bash
curl https://kroiautocenter.fi/api/health
# Expected: {"status":"healthy",...}
```

### Performance Check
```bash
curl -o /dev/null -s -w '%{time_total}\n' https://kroiautocenter.fi
# Expected: < 2.0 seconds
```

### SSL Check
```bash
curl -vI https://kroiautocenter.fi 2>&1 | grep -i "SSL"
# Expected: TLSv1.2 or TLSv1.3
```

### Security Headers Check
```bash
curl -I https://kroiautocenter.fi | grep -i "strict-transport-security"
# Expected: max-age=63072000
```

### Lighthouse Audit
```bash
npx lighthouse https://kroiautocenter.fi --only-categories=performance,accessibility,best-practices,seo
# Expected: All scores > 90
```

## Rollback Procedure

### Vercel
```bash
# 1. Find previous deployment
vercel ls

# 2. Promote previous deployment
vercel promote <deployment-url>

# 3. Verify
curl https://kroiautocenter.fi/api/health
```

### Docker
```bash
# 1. Stop current containers
docker-compose down

# 2. Pull previous version
docker pull ghcr.io/yourusername/kroi-auto-center:v0.9.0

# 3. Update docker-compose.yml with previous tag
# 4. Start containers
docker-compose up -d

# 5. Verify
curl http://localhost:3000/api/health
```

### AWS
```bash
# 1. Update to previous task definition
aws ecs update-service \
  --cluster kroi-cluster \
  --service kroi-service \
  --task-definition kroi-auto-center:previous

# 2. Monitor rollback
aws ecs describe-services --cluster kroi-cluster --services kroi-service

# 3. Verify
curl https://kroiautocenter.fi/api/health
```

## Emergency Contacts

**Deployment Issues:**
- DevOps Lead: [email]
- Platform Support: Vercel/AWS/DigitalOcean support

**Application Issues:**
- Lead Developer: [email]
- Backend Developer: [email]

**Infrastructure Issues:**
- System Administrator: [email]
- Database Administrator: [email]

**Monitoring:**
- Sentry: https://sentry.io
- Uptime Monitor: [service]
- Status Page: [url]

## Post-Mortem Template

If issues occur during deployment:

```markdown
# Deployment Post-Mortem - [Date]

## Summary
[Brief description of what happened]

## Timeline
- HH:MM - Deployment started
- HH:MM - Issue detected
- HH:MM - Investigation began
- HH:MM - Root cause identified
- HH:MM - Fix applied
- HH:MM - Service restored

## Root Cause
[What caused the issue]

## Impact
- Users affected: [number]
- Duration: [time]
- Revenue impact: [if applicable]

## Resolution
[How it was fixed]

## Action Items
- [ ] Prevent similar issues
- [ ] Update documentation
- [ ] Add monitoring/alerts
- [ ] Improve deployment process

## Lessons Learned
[What we learned]
```

## Success Criteria

Deployment is successful when:

1. Health check returns 200 OK
2. All pages load without errors
3. No critical errors in Sentry
4. Performance metrics within acceptable range
5. All critical user flows working
6. Zero downtime experienced
7. Monitoring and alerts operational
8. Backup completed successfully

## Sign-Off

Before marking deployment complete:

- [ ] Technical lead approval
- [ ] QA verification
- [ ] Product owner acceptance
- [ ] Documentation updated
- [ ] Team notified
- [ ] Status page updated

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Version:** _______________

**Sign-off:** _______________