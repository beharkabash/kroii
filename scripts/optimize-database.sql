-- Database optimization script for Render PostgreSQL
-- Run this after initial deployment to optimize performance

-- Enable extensions for better performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Optimize existing tables with additional indexes for common queries

-- Vehicles table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vehicles_search_text
ON vehicles USING gin((make || ' ' || model || ' ' || description) gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vehicles_price_year
ON vehicles (price, year) WHERE status = 'AVAILABLE';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vehicles_fuel_transmission
ON vehicles (fuelType, transmission) WHERE status = 'AVAILABLE';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vehicles_featured_available
ON vehicles (featured, createdAt) WHERE status = 'AVAILABLE';

-- Car table optimization (new model)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_car_search_text
ON "Car" USING gin((brand || ' ' || model || ' ' || description) gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_car_price_year
ON "Car" ("priceEur", year) WHERE status = 'AVAILABLE';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_car_fuel_transmission
ON "Car" (fuel, transmission) WHERE status = 'AVAILABLE';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_car_featured_available
ON "Car" (featured, "createdAt") WHERE status = 'AVAILABLE';

-- Inventory alerts optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_alerts_active_email
ON inventory_alerts (email, "isActive") WHERE "isActive" = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_alerts_criteria
ON inventory_alerts ("vehicleMake", "vehicleModel", "maxPrice", "minYear") WHERE "isActive" = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_alerts_notifications
ON inventory_alerts ("lastNotified", "notificationCount") WHERE "isActive" = true;

-- Contacts and leads optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contacts_status_created
ON contacts (status, "createdAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contacts_email_phone
ON contacts (email, phone);

-- Vehicle inquiries optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vehicle_inquiries_email
ON vehicle_inquiries (email, "createdAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vehicle_inquiries_status
ON vehicle_inquiries (status, "createdAt");

-- Testimonials optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_testimonials_public_rating
ON testimonials ("isPublic", "isApproved", rating) WHERE "isPublic" = true AND "isApproved" = true;

-- Finance applications optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_finance_applications_status
ON finance_applications (status, "createdAt");

-- Analytics and tracking optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recently_viewed_session_time
ON recently_viewed ("sessionId", "viewedAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_favorites_user_time
ON favorites ("userId", "createdAt");

-- Performance monitoring views
CREATE OR REPLACE VIEW slow_queries AS
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows,
  100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE mean_time > 1000  -- queries taking more than 1 second on average
ORDER BY mean_time DESC;

-- Database statistics view
CREATE OR REPLACE VIEW table_stats AS
SELECT
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_tuples,
  n_dead_tup as dead_tuples,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Index usage statistics
CREATE OR REPLACE VIEW index_usage AS
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Maintenance procedures
CREATE OR REPLACE FUNCTION analyze_all_tables()
RETURNS void AS $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE 'ANALYZE ' || quote_ident(table_name);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Auto-vacuum configuration optimization
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.1;
ALTER SYSTEM SET autovacuum_analyze_scale_factor = 0.05;
ALTER SYSTEM SET autovacuum_max_workers = 4;
ALTER SYSTEM SET autovacuum_naptime = '30s';

-- Connection and memory optimization
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Query optimization
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET default_statistics_target = 100;

-- Logging for monitoring
ALTER SYSTEM SET log_min_duration_statement = 5000; -- Log queries taking more than 5 seconds
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
ALTER SYSTEM SET log_statement = 'ddl'; -- Log DDL statements

-- Reload configuration
SELECT pg_reload_conf();

-- Update statistics
SELECT analyze_all_tables();

-- Clean up and optimize
VACUUM ANALYZE;