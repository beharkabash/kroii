# Infrastructure & Deployment Guide

Complete production infrastructure setup for Kroi Auto Center with monitoring, security, and scalability.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Deployment Options](#deployment-options)
4. [Infrastructure Setup](#infrastructure-setup)
5. [Monitoring & Observability](#monitoring--observability)
6. [Security](#security)
7. [Backup & Recovery](#backup--recovery)
8. [Scaling Strategy](#scaling-strategy)
9. [Cost Optimization](#cost-optimization)
10. [Troubleshooting](#troubleshooting)

## Quick Start

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/kroi-auto-center.git
cd kroi-auto-center

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Start development database (optional)
npm run docker:dev

# 5. Run application
npm run dev

# Open http://localhost:3000
```

### Production Deployment

Choose your platform:

- **[Vercel](./deployment/VERCEL.md)** - Easiest, automatic CI/CD, $0-50/month
- **[Docker](./deployment/DOCKER.md)** - Full control, VPS deployment, $20-100/month
- **[AWS](./deployment/AWS.md)** - Enterprise-grade, auto-scaling, $80-500/month

## Architecture Overview

### Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Users/Clients                       │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    CDN (CloudFront)                      │
│            • Global edge locations                       │
│            • Static asset caching                        │
│            • DDoS protection                             │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              Load Balancer (ALB/Nginx)                   │
│            • SSL termination                             │
│            • Health checks                               │
│            • Rate limiting                               │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────┐ ┌─────▼──────┐ ┌────▼───────┐
│   App Server  │ │ App Server │ │App Server  │
│  (Next.js)    │ │ (Next.js)  │ │(Next.js)   │
└───────┬───────┘ └─────┬──────┘ └────┬───────┘
        │               │              │
        └───────────────┼──────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼────────┐ ┌───▼─────┐ ┌──────▼──────┐
│   PostgreSQL   │ │  Redis  │ │   Storage   │
│   (Database)   │ │ (Cache) │ │   (S3/CDN)  │
└────────────────┘ └─────────┘ └─────────────┘
```

### Technology Stack

**Frontend/Backend:**
- Next.js 15.5.4 (React 19)
- TypeScript 5
- Tailwind CSS 4
- Framer Motion

**Database & Cache:**
- PostgreSQL 16 (primary database)
- Redis 7 (session cache, rate limiting)

**Monitoring:**
- Sentry (error tracking, performance)
- CloudWatch/Grafana (metrics)
- Custom health checks

**Infrastructure:**
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)

## Deployment Options

### 1. Vercel (Recommended for Most Users)

**Best for:**
- Quick deployments
- Automatic scaling
- Built-in CDN
- Zero DevOps

**Pros:**
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Preview deployments

**Cons:**
- ❌ Vendor lock-in
- ❌ Limited backend customization
- ❌ Higher cost at scale

**Cost:** $0-50/month

[→ Full Vercel Guide](./deployment/VERCEL.md)

### 2. Docker + VPS

**Best for:**
- Full control
- Custom infrastructure
- Budget-conscious
- Long-running processes

**Pros:**
- ✅ Complete control
- ✅ Predictable costs
- ✅ No vendor lock-in
- ✅ Custom configurations

**Cons:**
- ❌ Manual scaling
- ❌ Requires DevOps knowledge
- ❌ Server maintenance

**Cost:** $20-100/month

[→ Full Docker Guide](./deployment/DOCKER.md)

### 3. AWS (Enterprise)

**Best for:**
- High traffic
- Auto-scaling needs
- Enterprise requirements
- Complex infrastructure

**Pros:**
- ✅ Infinite scalability
- ✅ Enterprise-grade security
- ✅ Comprehensive services
- ✅ Global presence

**Cons:**
- ❌ Complex setup
- ❌ Higher costs
- ❌ Steep learning curve

**Cost:** $80-500/month

[→ Full AWS Guide](./deployment/AWS.md)

## Infrastructure Setup

### Environment Variables

Required for all deployments:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://kroiautocenter.fi

# Email
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=kroiautocenter@gmail.com

# Monitoring
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Database (optional)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis (optional)
REDIS_URL=redis://host:6379
```

### DNS Configuration

Point your domain to the deployment:

**Vercel:**
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

**Custom Server:**
```
Type    Name    Value
A       @       YOUR_SERVER_IP
A       www     YOUR_SERVER_IP
```

### SSL/TLS Setup

**Vercel/AWS:** Automatic via platform

**Custom Server (Let's Encrypt):**
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d kroiautocenter.fi -d www.kroiautocenter.fi

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring & Observability

### Sentry Setup

1. **Create Sentry Project**
   ```bash
   # Sign up at https://sentry.io
   # Create Next.js project
   # Copy DSN
   ```

2. **Configure Environment**
   ```env
   SENTRY_DSN=your_dsn_here
   NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
   SENTRY_TRACES_SAMPLE_RATE=0.1
   ```

3. **Verify Integration**
   ```bash
   npm run build
   # Check Sentry dashboard for events
   ```

### Health Monitoring

**Health Check Endpoint:**
```bash
curl https://kroiautocenter.fi/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 123456,
  "version": "1.0.0",
  "checks": {
    "server": true,
    "memory": {
      "status": true,
      "percentage": 45
    }
  }
}
```

### Uptime Monitoring

Use services like:
- **UptimeRobot** - Free, 5-minute checks
- **Pingdom** - Advanced monitoring
- **StatusCake** - Budget-friendly
- **AWS CloudWatch** - Integrated with AWS

Setup:
```bash
# Add health check URL
https://kroiautocenter.fi/api/health

# Configure alerts
- Email on downtime
- SMS for critical issues
- Slack integration
```

### Performance Monitoring

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Monitoring via:**
- Vercel Analytics
- Google Analytics 4
- Sentry Performance
- Custom `/api/vitals` endpoint

### Log Aggregation

**Production Logging:**
```bash
# Docker logs
docker-compose logs -f app

# System logs (Linux)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# CloudWatch (AWS)
aws logs tail /ecs/kroi-auto-center --follow
```

**Structured Logging:**
```typescript
import { logger } from '@/lib/logger';

logger.info('User action', { userId, action });
logger.error('API error', error, { endpoint, statusCode });
```

## Security

### Security Headers

Automatically configured in `next.config.ts`:

```typescript
headers: [
  'Strict-Transport-Security',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'X-XSS-Protection',
  'Referrer-Policy',
  'Content-Security-Policy',
  'Permissions-Policy',
]
```

### Rate Limiting

**API Protection:**
```typescript
// Configured in environment
ENABLE_RATE_LIMITING=true
RATE_LIMIT_MAX_REQUESTS=3
RATE_LIMIT_WINDOW_MS=60000
```

**Nginx Rate Limiting:**
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;
limit_req zone=api burst=10 nodelay;
```

### Secrets Management

**Development:**
```bash
# Use .env.local (never commit)
cp .env.example .env.local
```

**Production (Vercel):**
```bash
# Via dashboard: Settings → Environment Variables
# Or CLI
vercel env add RESEND_API_KEY
```

**Production (Docker):**
```bash
# Use Docker secrets
docker secret create resend_api_key ./resend_key.txt
```

**Production (AWS):**
```bash
# Use AWS Secrets Manager
aws secretsmanager create-secret \
  --name kroi/resend-api-key \
  --secret-string "re_xxxxxxxxxxxx"
```

### Security Scanning

**Automated in CI/CD:**
- npm audit (dependency vulnerabilities)
- Snyk (security scanning)
- OWASP Dependency Check
- Trivy (Docker image scanning)

**Manual Scans:**
```bash
# Check dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Security scan
npx snyk test
```

## Backup & Recovery

### Database Backups

**Automated Backups:**
```bash
# Daily backup (cron)
0 2 * * * /opt/kroi-auto-center/scripts/backup/backup-database.sh

# Manual backup
./scripts/backup/backup-database.sh production
```

**Restore Database:**
```bash
./scripts/backup/restore-database.sh /path/to/backup.sql.gz
```

### Static Files Backup

**Upload to S3:**
```bash
aws s3 sync ./public/cars s3://kroi-backups/static/cars
```

### Disaster Recovery

**RTO (Recovery Time Objective):** < 1 hour
**RPO (Recovery Point Objective):** < 24 hours

**Recovery Steps:**
1. Deploy application from latest Docker image
2. Restore database from backup
3. Verify health checks
4. Update DNS if needed
5. Monitor error rates

## Scaling Strategy

### Vertical Scaling

**Increase Resources:**
```yaml
# Docker Compose
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 8G
```

**When to Scale Up:**
- CPU usage > 80%
- Memory usage > 80%
- Response time increasing

### Horizontal Scaling

**Add More Instances:**
```bash
# Docker Swarm
docker service scale kroi_app=5

# ECS
aws ecs update-service \
  --cluster kroi-cluster \
  --service kroi-service \
  --desired-count 5
```

**Auto-Scaling (AWS):**
```bash
# Based on CPU
TargetValue: 70.0
PredefinedMetricType: ECSServiceAverageCPUUtilization
```

### Database Scaling

**Read Replicas:**
```bash
# Create read replica (AWS RDS)
aws rds create-db-instance-read-replica \
  --db-instance-identifier kroi-postgres-replica \
  --source-db-instance-identifier kroi-postgres
```

**Connection Pooling:**
```typescript
// Use PgBouncer or built-in pooling
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true
```

### CDN Configuration

**CloudFront Setup:**
- Cache static assets globally
- Reduce origin load by 80%+
- Improve performance worldwide

## Cost Optimization

### Infrastructure Costs

**Vercel:**
- Hobby: $0/month (personal projects)
- Pro: $20/month (small business)
- Enterprise: Custom pricing

**VPS (DigitalOcean/Linode):**
- Basic: $12/month (1GB RAM)
- Standard: $24/month (2GB RAM)
- Performance: $48/month (4GB RAM)

**AWS:**
- Compute (ECS): $30-100/month
- Database (RDS): $15-50/month
- Cache (ElastiCache): $12-30/month
- Monitoring: $5-20/month

### Optimization Tips

1. **Use CDN** - Reduce bandwidth costs
2. **Image Optimization** - Reduce storage/transfer
3. **Database Indexing** - Reduce compute costs
4. **Caching** - Reduce database queries
5. **Reserved Instances** - 30-60% savings (AWS)
6. **Spot Instances** - 70% savings (ECS Fargate Spot)

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection Issues:**
```bash
# Check database is running
docker-compose ps postgres

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**High Memory Usage:**
```bash
# Check container stats
docker stats kroi-auto-center

# Increase memory limit
# Edit docker-compose.yml
```

**Slow Response Times:**
```bash
# Check logs
docker-compose logs app

# Monitor metrics
curl http://localhost:3000/api/health

# Check database queries
# Enable query logging in PostgreSQL
```

### Debug Mode

```bash
# Enable debug logging
NODE_ENV=development npm run dev

# Docker debug
docker-compose logs -f app

# Check health status
curl -v http://localhost:3000/api/health
```

## Support & Resources

### Documentation

- [Vercel Deployment](./deployment/VERCEL.md)
- [Docker Deployment](./deployment/DOCKER.md)
- [AWS Deployment](./deployment/AWS.md)

### External Resources

- **Next.js**: https://nextjs.org/docs
- **Docker**: https://docs.docker.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **Sentry**: https://docs.sentry.io

### Community

- GitHub Issues
- Discussions
- Email: support@kroiautocenter.fi