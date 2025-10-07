# Database Architecture Documentation
# Kroi Auto Center - Production-Ready Database System

## Overview

This document provides comprehensive documentation for the Kroi Auto Center database architecture, including schema design, implementation details, optimization strategies, and operational procedures.

## Technology Stack

- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.x
- **Cache**: Redis 7.x
- **Authentication**: NextAuth.js with Prisma Adapter
- **Environment**: Docker containers for local development

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Car Service  │  │Contact Service│  │ Auth Service │     │
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘     │
│         │                  │                   │             │
└─────────┼──────────────────┼───────────────────┼─────────────┘
          │                  │                   │
     ┌────▼──────────────────▼───────────────────▼────┐
     │              Prisma ORM Client                  │
     │        (Type-safe database access)              │
     └────┬──────────────────┬────────────────────┬────┘
          │                  │                    │
   ┌──────▼──────┐    ┌──────▼──────┐     ┌──────▼──────┐
   │ PostgreSQL  │    │    Redis    │     │  Backups    │
   │  (Primary)  │    │   (Cache)   │     │  (Storage)  │
   └─────────────┘    └─────────────┘     └─────────────┘
```

## Database Schema

### Core Tables

#### 1. Users & Authentication

**users**
- Stores admin user accounts
- Password hashed with bcrypt
- Role-based access control (SUPER_ADMIN, ADMIN, VIEWER)
- Tracks last login timestamp

**accounts**
- OAuth provider accounts (future integration)
- Linked to users table

**sessions**
- Active user sessions
- Session token management

**verification_tokens**
- Email verification tokens
- Password reset tokens

#### 2. Car Inventory

**cars**
- Main car inventory table
- Comprehensive car information (brand, model, year, price, etc.)
- Status tracking (AVAILABLE, RESERVED, SOLD, etc.)
- SEO metadata (metaTitle, metaDescription)
- Full-text search enabled
- Soft delete support

**car_images**
- Multiple images per car
- Ordered display
- Primary image designation
- CDN-ready URLs

**car_features**
- Feature list for each car
- Ordered display
- Easily extensible

**car_specifications**
- Technical specifications
- Label-value pairs
- Ordered display

#### 3. Lead Management

**contact_submissions**
- Contact form submissions
- Lead scoring and prioritization
- Status tracking (NEW, CONTACTED, QUALIFIED, etc.)
- Car association for inquiries
- IP and user agent tracking
- Assignment to admin users

**contact_notes**
- Internal notes on leads
- User attribution
- Timestamp tracking

**contact_activities**
- Activity timeline for each lead
- Type-based activities (email, call, meeting, etc.)
- JSON metadata for flexibility

#### 4. Analytics & Tracking

**car_views**
- Page view tracking for cars
- Session tracking
- IP and user agent logging

**page_views**
- General page view analytics
- Performance metrics
- Referrer tracking

**web_vitals**
- Core Web Vitals tracking
- Performance monitoring
- Path-based analysis

#### 5. System

**activity_logs**
- Admin action logging
- Entity tracking
- JSON metadata

**system_config**
- Dynamic configuration
- Key-value store with JSON values

**newsletter_subscribers**
- Newsletter subscriptions
- Status tracking
- Preference management

## Indexing Strategy

### Primary Indexes

All tables have primary key indexes automatically created by PostgreSQL.

### Secondary Indexes

**Cars Table:**
- `idx_cars_slug` - Fast slug lookup
- `idx_cars_brand` - Brand filtering
- `idx_cars_status` - Status filtering
- `idx_cars_category` - Category filtering
- `idx_cars_featured` - Featured cars
- `idx_cars_price` - Price range queries
- `idx_cars_year` - Year filtering
- `idx_cars_created_at` - Latest listings

**Contact Submissions:**
- `idx_contacts_email` - Email lookup
- `idx_contacts_status` - Status filtering
- `idx_contacts_lead_score` - Priority sorting
- `idx_contacts_created_at` - Recent leads
- `idx_contacts_car_id` - Car inquiries

**Analytics:**
- `idx_car_views_car_id` - View counts per car
- `idx_car_views_created_at` - Time-series analysis
- `idx_page_views_path` - Page analytics
- `idx_web_vitals_name` - Metric type filtering

## Caching Strategy

### Redis Implementation

**Cache Keys:**
```typescript
car:{id}                    // Individual car details
car:slug:{slug}             // Car by slug
cars:list:{filters}         // Filtered car listings
cars:brand:{brand}          // Cars by brand
cars:category:{category}    // Cars by category
cars:related:{id}           // Related cars
cars:featured               // Featured cars
analytics:views:{carId}     // View counts
contacts:{status}           // Contacts by status
```

**TTL Strategy:**
- Short (1 min): Frequently changing data
- Medium (5 min): Car listings with filters
- Long (1 hour): Individual car details
- Day (24 hours): Analytics aggregations
- Week (7 days): Static configuration

### Cache Invalidation

**On Car Update:**
- Delete specific car cache
- Pattern delete: `cars:*`

**On Contact Creation:**
- Pattern delete: `contacts:*`

**On Analytics Update:**
- Increment counters
- Pattern delete for aggregations

## Query Optimization

### Best Practices Implemented

1. **Selective Queries**
   - Only fetch required fields
   - Use `select` to limit columns
   - Avoid N+1 queries with `include`

2. **Pagination**
   - Cursor-based pagination for large datasets
   - Limit/offset for small datasets
   - Index on pagination columns

3. **Filtering**
   - Indexes on filter columns
   - Composite indexes for common filter combinations

4. **Sorting**
   - Indexes on sort columns
   - Avoid sorting on unindexed columns

5. **Full-Text Search**
   - PostgreSQL full-text search
   - Trigram indexes for fuzzy matching

### Example Optimized Queries

```typescript
// Efficient: Only fetch needed fields with relations
const cars = await prisma.car.findMany({
  select: {
    id: true,
    name: true,
    priceEur: true,
    images: {
      where: { isPrimary: true },
      take: 1,
    },
  },
  where: { status: 'AVAILABLE' },
  take: 20,
});

// Efficient: Use cursor pagination for large datasets
const cars = await prisma.car.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastCarId },
  orderBy: { createdAt: 'desc' },
});
```

## Backup & Recovery

### Backup Strategy

**Automated Backups:**
- Full backup: Daily at 2 AM UTC
- Incremental backup: Every 6 hours
- Retention: 30 days
- Offsite storage: AWS S3 or similar

**Manual Backup Command:**
```bash
# Export entire database
docker exec kroi-postgres-dev pg_dump -U kroi kroi_auto_center > backup_$(date +%Y%m%d).sql

# Export with compression
docker exec kroi-postgres-dev pg_dump -U kroi kroi_auto_center | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Recovery Procedures

**Restore from Backup:**
```bash
# Restore from SQL file
docker exec -i kroi-postgres-dev psql -U kroi kroi_auto_center < backup.sql

# Restore from compressed file
gunzip -c backup.sql.gz | docker exec -i kroi-postgres-dev psql -U kroi kroi_auto_center
```

**Point-in-Time Recovery:**
- Enable WAL archiving
- Configure continuous archiving
- Use pg_basebackup for base backups

## Database Migrations

### Migration Workflow

1. **Create Migration:**
   ```bash
   npm run db:migrate
   # Enter migration name when prompted
   ```

2. **Review Migration:**
   - Check `prisma/migrations/` folder
   - Review SQL changes
   - Test in development

3. **Deploy to Production:**
   ```bash
   npm run db:migrate:deploy
   ```

### Migration Best Practices

- Always review auto-generated SQL
- Test migrations in staging first
- Create rollback scripts
- Document breaking changes
- Never modify existing migrations

### Common Migrations

**Add New Column:**
```prisma
model Car {
  // ... existing fields
  vin String? // New field
}
```

**Create Index:**
```sql
CREATE INDEX idx_cars_vin ON cars(vin);
```

**Add Constraint:**
```sql
ALTER TABLE cars ADD CONSTRAINT unique_vin UNIQUE (vin);
```

## Monitoring & Performance

### Key Metrics to Monitor

1. **Query Performance**
   - Slow query log (> 1 second)
   - Query execution plans
   - Connection pool usage

2. **Database Health**
   - CPU and memory usage
   - Disk I/O
   - Connection count
   - Replication lag

3. **Cache Performance**
   - Hit rate (target: > 80%)
   - Memory usage
   - Key evictions

4. **Application Metrics**
   - API response times
   - Error rates
   - Cache miss patterns

### Monitoring Tools

**PostgreSQL:**
- `pg_stat_statements` - Query statistics
- `pg_stat_activity` - Current connections
- `pgAdmin` - GUI management tool

**Redis:**
- `redis-cli INFO` - Server stats
- `redis-cli MONITOR` - Real-time commands
- RedisInsight - GUI tool

**Application:**
- Prisma metrics
- Custom logging
- APM tools (Sentry, DataDog)

### Performance Tuning

**PostgreSQL Configuration:**
```ini
# postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 64MB
max_connections = 100
```

**Connection Pooling:**
```typescript
// Prisma connection pool
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  pool_size = 20
  connection_timeout = 30
}
```

## Security Measures

### Implemented Security Features

1. **Access Control**
   - Role-based permissions
   - Row-level security (future)
   - API authentication required

2. **Data Protection**
   - Password hashing (bcrypt)
   - SQL injection prevention (Prisma)
   - XSS protection (sanitization)
   - Rate limiting on forms

3. **Connection Security**
   - SSL/TLS for production
   - Environment variable secrets
   - No credentials in code

4. **Audit Trail**
   - Activity logging
   - Contact activity tracking
   - Admin action logging

### Security Best Practices

- Rotate database passwords regularly
- Use separate credentials for dev/prod
- Enable SSL for all connections
- Regular security updates
- Monitor for suspicious activity
- Implement IP whitelisting for admin

## Deployment

### Local Development Setup

1. **Start Services:**
   ```bash
   npm run docker:dev
   ```

2. **Setup Environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   ```

3. **Initialize Database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. **Start Application:**
   ```bash
   npm run dev
   ```

### Production Deployment

**Vercel (Recommended):**
- Connect Vercel Postgres
- Set environment variables
- Deploy automatically via Git

**Docker:**
```bash
docker-compose up -d
```

**Manual:**
1. Setup PostgreSQL server
2. Setup Redis server
3. Configure DATABASE_URL
4. Run migrations: `npm run db:migrate:deploy`
5. Start application: `npm start`

## Troubleshooting

### Common Issues

**Connection Refused:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker exec -it kroi-postgres-dev psql -U kroi -d kroi_auto_center
```

**Migration Errors:**
```bash
# Reset database (development only!)
npm run db:reset

# Force push schema
npm run db:push
```

**Cache Issues:**
```bash
# Flush Redis cache
docker exec -it kroi-redis-dev redis-cli FLUSHALL

# Check Redis connection
docker exec -it kroi-redis-dev redis-cli PING
```

**Performance Issues:**
```sql
-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::regclass))
FROM pg_tables
WHERE schemaname = 'public';
```

## Maintenance Procedures

### Regular Maintenance Tasks

**Daily:**
- Monitor error logs
- Check backup completion
- Review slow queries

**Weekly:**
- Analyze query performance
- Review cache hit rates
- Check disk usage

**Monthly:**
- Vacuum analyze
- Update statistics
- Review indexes
- Rotate logs

**Quarterly:**
- Performance audit
- Security review
- Capacity planning
- Update dependencies

### Vacuum and Analyze

```sql
-- Vacuum all tables
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE cars;

-- Full vacuum (requires downtime)
VACUUM FULL;
```

## Future Enhancements

### Planned Features

1. **Read Replicas**
   - Setup read replicas for scaling
   - Route read queries to replicas
   - Automatic failover

2. **Full-Text Search**
   - PostgreSQL FTS
   - Elasticsearch integration
   - Multi-language support

3. **Data Warehousing**
   - Separate analytics database
   - ETL pipelines
   - Business intelligence tools

4. **Advanced Caching**
   - CDN integration
   - Edge caching
   - Cache warming strategies

5. **Machine Learning**
   - Lead scoring models
   - Price predictions
   - Recommendation engine

## Support & Resources

### Documentation
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Redis Docs: https://redis.io/documentation

### Tools
- Prisma Studio: `npm run db:studio`
- pgAdmin: PostgreSQL GUI
- RedisInsight: Redis GUI

### Contact
For database-related issues, contact the development team or refer to the main README.md file.
