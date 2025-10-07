# Database Quick Start Guide
# Get Up and Running in 5 Minutes

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed

## Setup Steps

### 1. Install Dependencies (30 seconds)

```bash
npm install
```

### 2. Configure Environment (1 minute)

```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local and set these minimum required values:
# DATABASE_URL=postgresql://kroi:kroi_dev_password@localhost:5432/kroi_auto_center
# REDIS_URL=redis://localhost:6379
# NEXTAUTH_SECRET=your_generated_secret_here
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Start Database Services (30 seconds)

```bash
npm run docker:dev
```

This starts:
- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)

### 4. Initialize Database (2 minutes)

```bash
# Generate Prisma client
npm run db:generate

# Run migrations (creates all tables)
npm run db:migrate

# Seed with sample data (9 cars + admin user)
npm run db:seed
```

### 5. Start Application (30 seconds)

```bash
npm run dev
```

Visit: **http://localhost:3000**

## Default Admin Credentials

```
Email: admin@kroiautocenter.fi
Password: admin123
```

⚠️ **IMPORTANT:** Change this password in production!

## Verify Installation

### Check Database Status

```bash
./scripts/monitor-database.sh
```

Should show:
- ✅ PostgreSQL Running
- ✅ Redis Running
- ✅ Database size
- ✅ Table count (20+ tables)

### Open Database GUI

```bash
npm run db:studio
```

Opens Prisma Studio at: **http://localhost:5555**

### Test Redis Connection

```bash
docker exec -it kroi-redis-dev redis-cli PING
```

Should respond: `PONG`

## What Got Created?

### Database Tables (20+)
- ✅ cars, car_images, car_features, car_specifications
- ✅ contact_submissions, contact_notes, contact_activities
- ✅ users, accounts, sessions, verification_tokens
- ✅ car_views, page_views, web_vitals
- ✅ newsletter_subscribers, activity_logs, system_config

### Sample Data
- ✅ 9 cars (migrated from TypeScript)
- ✅ 1 admin user
- ✅ 1 sample contact submission
- ✅ All with proper relationships

### Cache Setup
- ✅ Redis running and configured
- ✅ Cache utilities implemented
- ✅ Auto-invalidation ready

## Essential Commands

### Database Management

```bash
# Open database GUI
npm run db:studio

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed

# Reset database (⚠️ deletes all data)
npm run db:reset
```

### Docker Management

```bash
# Start databases
npm run docker:dev

# Stop databases
npm run docker:dev:stop

# View logs
docker logs kroi-postgres-dev
docker logs kroi-redis-dev
```

### Backup & Monitoring

```bash
# Create backup
./scripts/backup-database.sh

# Monitor health
./scripts/monitor-database.sh

# Restore backup
./scripts/restore-database.sh backups/backup_file.sql.gz
```

## Using the Database

### Query Cars

```typescript
import { listCars, getCarById } from '@/app/lib/services/car.service';

// Get all available cars
const cars = await listCars({ status: 'AVAILABLE' });

// Get car by ID
const car = await getCarById('car_id');

// Get filtered cars
const filteredCars = await listCars({
  brand: 'BMW',
  minPrice: 10000,
  maxPrice: 20000,
  limit: 10,
});
```

### Create Contact Submission

```typescript
import { createContactSubmission } from '@/app/lib/services/contact.service';

const contact = await createContactSubmission({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+358401234567',
  message: 'Interested in BMW 318',
  carId: 'car_id',
  leadScore: 75,
});
```

### Direct Prisma Access

```typescript
import { prisma } from '@/app/lib/db/prisma';

// Create car
const car = await prisma.car.create({
  data: {
    slug: 'bmw-x5-2024',
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5',
    year: 2024,
    priceEur: 45000,
    // ... other fields
  },
});

// Query with relations
const carWithImages = await prisma.car.findUnique({
  where: { id: 'car_id' },
  include: {
    images: true,
    features: true,
    specifications: true,
  },
});
```

## Troubleshooting

### Problem: Connection Refused

```bash
# Check if services are running
docker ps

# Should see: kroi-postgres-dev and kroi-redis-dev
# If not, start them:
npm run docker:dev
```

### Problem: Migration Errors

```bash
# Check migration status
npx prisma migrate status

# Reset database (development only!)
npm run db:reset

# Or push schema without migration
npm run db:push
```

### Problem: Port Already in Use

```bash
# PostgreSQL (5432) or Redis (6379) already running?
# Stop existing services or change ports in docker-compose.dev.yml
```

### Problem: Cannot Connect to Database

```bash
# Check DATABASE_URL in .env.local
echo $DATABASE_URL

# Test connection
docker exec -it kroi-postgres-dev psql -U kroi -d kroi_auto_center
```

## Next Steps

After setup is complete:

1. **Explore the database:**
   - Open Prisma Studio: `npm run db:studio`
   - Browse tables and data
   - Try creating/editing records

2. **Build admin dashboard:**
   - Create car management UI
   - Build lead management interface
   - Implement authentication

3. **Develop API endpoints:**
   - Car CRUD operations
   - Contact form integration
   - File upload system

4. **Deploy to production:**
   - Setup managed PostgreSQL (Vercel/Supabase)
   - Setup managed Redis (Upstash)
   - Configure environment variables
   - Run migrations: `npm run db:migrate:deploy`

## Documentation

For more details, see:

- **DATABASE_SETUP.md** - Comprehensive setup guide
- **DATABASE_ARCHITECTURE.md** - Technical documentation
- **DATABASE_README.md** - Implementation overview
- **DATABASE_IMPLEMENTATION_COMPLETE.md** - Project summary

## Support

**Common Issues:**
- Check Docker is running
- Verify .env.local configuration
- Review logs: `docker logs kroi-postgres-dev`
- Run health check: `./scripts/monitor-database.sh`

**Resources:**
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Redis Docs: https://redis.io/documentation

---

**Congratulations!** Your database is ready for development! 🎉

Start building with: `npm run dev`
