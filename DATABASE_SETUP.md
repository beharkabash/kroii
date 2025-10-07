# Database Setup Guide
# Kroi Auto Center - Quick Start Guide

This guide will walk you through setting up the complete database infrastructure for Kroi Auto Center, from local development to production deployment.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Quick Start (5 minutes)

```bash
# 1. Clone and install dependencies
git clone <repository>
cd kroi-auto-center
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Start database services (PostgreSQL + Redis)
npm run docker:dev

# 4. Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. Start application
npm run dev
```

Visit http://localhost:3000 to see your application!

## Detailed Setup Instructions

### Step 1: Environment Configuration

Edit `.env.local` with your settings:

```env
# Required for database
DATABASE_URL=postgresql://kroi:kroi_dev_password@localhost:5432/kroi_auto_center
REDIS_URL=redis://localhost:6379

# Required for authentication (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Email service
RESEND_API_KEY=your_resend_api_key
```

### Step 2: Start Database Services

**Option A: Docker (Recommended)**

```bash
# Start PostgreSQL and Redis
npm run docker:dev

# Verify services are running
docker ps

# Should see: kroi-postgres-dev and kroi-redis-dev
```

**Option B: Manual Installation**

If you prefer not to use Docker:

**PostgreSQL:**
```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt-get install postgresql-16
sudo systemctl start postgresql

# Create database
createdb kroi_auto_center
```

**Redis:**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

### Step 3: Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Seed with initial data
npm run db:seed
```

After seeding, you'll have:
- 9 cars migrated from TypeScript data
- 1 admin user (admin@kroiautocenter.fi / admin123)
- 1 sample contact submission

### Step 4: Verify Setup

```bash
# Check database status
./scripts/monitor-database.sh

# Open Prisma Studio (database GUI)
npm run db:studio

# Test Redis connection
docker exec -it kroi-redis-dev redis-cli PING
# Should respond: PONG
```

## Default Admin Credentials

After seeding, use these credentials to access the admin panel:

```
Email: admin@kroiautocenter.fi
Password: admin123
```

**⚠️ IMPORTANT: Change this password immediately in production!**

## Database Management Commands

### Development

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply migration
npm run db:migrate

# Push schema without migration (dev only)
npm run db:push

# Open Prisma Studio
npm run db:studio

# Reset database (⚠️ deletes all data)
npm run db:reset
```

### Backup & Restore

```bash
# Create backup
./scripts/backup-database.sh

# Restore from backup
./scripts/restore-database.sh ./backups/kroi_auto_center_20250927.sql.gz

# Monitor database health
./scripts/monitor-database.sh
```

### Docker Management

```bash
# Start services
npm run docker:dev

# Stop services
npm run docker:dev:stop

# View logs
docker logs kroi-postgres-dev
docker logs kroi-redis-dev

# Access PostgreSQL shell
docker exec -it kroi-postgres-dev psql -U kroi -d kroi_auto_center

# Access Redis shell
docker exec -it kroi-redis-dev redis-cli
```

## Database Schema Overview

### Main Tables

**Cars & Inventory:**
- `cars` - Main car listings
- `car_images` - Multiple images per car
- `car_features` - Car features list
- `car_specifications` - Technical specs

**Leads & Contacts:**
- `contact_submissions` - Contact form submissions
- `contact_notes` - Internal notes on leads
- `contact_activities` - Activity timeline

**Authentication:**
- `users` - Admin users
- `accounts` - OAuth accounts
- `sessions` - Active sessions

**Analytics:**
- `car_views` - Car page views
- `page_views` - General analytics
- `web_vitals` - Performance metrics

**System:**
- `activity_logs` - Admin action logs
- `newsletter_subscribers` - Email list
- `system_config` - App configuration

## Caching Strategy

Redis is used for caching frequently accessed data:

**Cached Data:**
- Individual car details (1 hour)
- Car listings (5 minutes)
- Related cars (1 hour)
- Featured cars (5 minutes)
- View counts (24 hours)

**Cache Invalidation:**
- Automatic on car updates
- Pattern-based deletion
- Manual flush: `docker exec kroi-redis-dev redis-cli FLUSHALL`

## Production Deployment

### Option 1: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Add Vercel Postgres
vercel postgres create

# 4. Add Upstash Redis
# Visit https://upstash.com and create Redis database

# 5. Set environment variables
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add NEXTAUTH_SECRET

# 6. Deploy
vercel --prod
```

### Option 2: Docker

```bash
# Build image
docker build -t kroi-auto-center .

# Run with docker-compose
docker-compose up -d

# Run migrations
docker exec kroi-auto-center npm run db:migrate:deploy
```

### Option 3: VPS/Server

```bash
# 1. Install dependencies
sudo apt-get update
sudo apt-get install postgresql-16 redis-server nodejs npm

# 2. Clone repository
git clone <repository>
cd kroi-auto-center
npm install

# 3. Setup environment
cp .env.example .env.production
# Edit .env.production

# 4. Run migrations
npm run db:migrate:deploy

# 5. Start application (use PM2 for process management)
npm install -g pm2
pm2 start npm --name "kroi-auto-center" -- start
```

## Troubleshooting

### Connection Issues

**Problem:** `Error: P1001: Can't reach database server`

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker exec -it kroi-postgres-dev psql -U kroi -d kroi_auto_center
```

### Migration Errors

**Problem:** `Migration failed`

**Solution:**
```bash
# Check migration history
npx prisma migrate status

# Reset database (dev only!)
npm run db:reset

# Force push schema
npm run db:push
```

### Cache Issues

**Problem:** Stale data being served

**Solution:**
```bash
# Clear Redis cache
docker exec -it kroi-redis-dev redis-cli FLUSHALL

# Restart Redis
docker restart kroi-redis-dev

# Check Redis health
docker exec -it kroi-redis-dev redis-cli PING
```

### Performance Issues

**Problem:** Slow queries

**Solution:**
```sql
-- Connect to database
docker exec -it kroi-postgres-dev psql -U kroi -d kroi_auto_center

-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM cars WHERE status = 'AVAILABLE';
```

## Common Tasks

### Adding a New Car

```typescript
// Using API
await fetch('/api/cars', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'bmw-x5-2024',
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5',
    year: 2024,
    priceEur: 45000,
    // ... other fields
  }),
});

// Or using Prisma Studio
npm run db:studio
```

### Updating Car Status

```typescript
// Mark as sold
await prisma.car.update({
  where: { id: 'car_id' },
  data: { 
    status: 'SOLD',
    soldAt: new Date()
  },
});
```

### Viewing Contact Submissions

```bash
# Open Prisma Studio
npm run db:studio

# Or query directly
docker exec -it kroi-postgres-dev psql -U kroi -d kroi_auto_center -c "SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 10;"
```

## Monitoring & Maintenance

### Daily Tasks

```bash
# Check database health
./scripts/monitor-database.sh

# Review logs
docker logs kroi-postgres-dev --tail 100
```

### Weekly Tasks

```bash
# Create backup
./scripts/backup-database.sh

# Check disk usage
docker exec kroi-postgres-dev df -h

# Review slow queries
# (Use monitoring script or query pg_stat_statements)
```

### Monthly Tasks

```bash
# Vacuum database
docker exec kroi-postgres-dev psql -U kroi -d kroi_auto_center -c "VACUUM ANALYZE;"

# Update dependencies
npm update

# Review analytics
npm run db:studio
```

## Security Best Practices

1. **Change Default Passwords**
   - Change admin password after first login
   - Use strong passwords (16+ characters)
   - Enable 2FA if available

2. **Secure Environment Variables**
   - Never commit .env files
   - Use separate credentials for dev/prod
   - Rotate secrets regularly

3. **Database Access**
   - Limit network access to database
   - Use SSL/TLS for connections
   - Regular security audits

4. **Backups**
   - Automated daily backups
   - Test restore procedures
   - Store backups securely offsite

5. **Monitoring**
   - Set up alerts for errors
   - Monitor database performance
   - Track suspicious activity

## Getting Help

### Resources

- **Prisma Documentation:** https://www.prisma.io/docs
- **PostgreSQL Manual:** https://www.postgresql.org/docs/
- **Redis Documentation:** https://redis.io/documentation
- **Next.js Database:** https://nextjs.org/docs/app/building-your-application/data-fetching

### Support

For issues or questions:
1. Check this documentation
2. Review DATABASE_ARCHITECTURE.md
3. Check GitHub issues
4. Contact the development team

## Next Steps

After completing this setup:

1. ✅ Test the application locally
2. ✅ Review the admin panel
3. ✅ Add your own car listings
4. ✅ Configure email service (Resend)
5. ✅ Setup analytics (Google Analytics)
6. ✅ Deploy to production
7. ✅ Configure monitoring
8. ✅ Setup automated backups

Congratulations! Your database is now ready for production use! 🎉
