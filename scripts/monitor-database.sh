#!/bin/bash
##
# Database Monitoring Script
# Kroi Auto Center - Health Check & Monitoring
##

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DB_CONTAINER="${DB_CONTAINER:-kroi-postgres-dev}"
REDIS_CONTAINER="${REDIS_CONTAINER:-kroi-redis-dev}"
DB_USER="${DB_USER:-kroi}"
DB_NAME="${DB_NAME:-kroi_auto_center}"

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  Kroi Auto Center - Database Monitor${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Check PostgreSQL
echo -e "${GREEN}📊 PostgreSQL Status:${NC}"
if docker ps | grep -q "$DB_CONTAINER"; then
    echo -e "  Status: ${GREEN}✓ Running${NC}"
    
    # Database size
    DB_SIZE=$(docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" | xargs)
    echo -e "  Database Size: $DB_SIZE"
    
    # Connection count
    CONN_COUNT=$(docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname='$DB_NAME';" | xargs)
    echo -e "  Active Connections: $CONN_COUNT"
    
    # Table count
    TABLE_COUNT=$(docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" | xargs)
    echo -e "  Tables: $TABLE_COUNT"
else
    echo -e "  Status: ${RED}✗ Not Running${NC}"
fi
echo ""

# Check Redis
echo -e "${GREEN}💾 Redis Status:${NC}"
if docker ps | grep -q "$REDIS_CONTAINER"; then
    echo -e "  Status: ${GREEN}✓ Running${NC}"
    
    # Memory usage
    REDIS_MEM=$(docker exec "$REDIS_CONTAINER" redis-cli INFO memory | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
    echo -e "  Memory Used: $REDIS_MEM"
    
    # Key count
    REDIS_KEYS=$(docker exec "$REDIS_CONTAINER" redis-cli DBSIZE | cut -d: -f2 | xargs)
    echo -e "  Keys: $REDIS_KEYS"
    
    # Hit rate
    HITS=$(docker exec "$REDIS_CONTAINER" redis-cli INFO stats | grep "keyspace_hits" | cut -d: -f2 | tr -d '\r')
    MISSES=$(docker exec "$REDIS_CONTAINER" redis-cli INFO stats | grep "keyspace_misses" | cut -d: -f2 | tr -d '\r')
    if [ ! -z "$HITS" ] && [ ! -z "$MISSES" ]; then
        TOTAL=$((HITS + MISSES))
        if [ $TOTAL -gt 0 ]; then
            HIT_RATE=$((HITS * 100 / TOTAL))
            echo -e "  Cache Hit Rate: ${HIT_RATE}%"
        fi
    fi
else
    echo -e "  Status: ${RED}✗ Not Running${NC}"
fi
echo ""

# Top 5 largest tables
echo -e "${GREEN}📈 Top 5 Largest Tables:${NC}"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        tablename,
        pg_size_pretty(pg_total_relation_size(tablename::regclass)) AS size
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(tablename::regclass) DESC
    LIMIT 5;
" 2>/dev/null || echo "  Could not retrieve table sizes"
echo ""

# Recent activity
echo -e "${GREEN}🔄 Recent Database Activity:${NC}"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        datname,
        usename,
        application_name,
        state,
        query_start
    FROM pg_stat_activity
    WHERE datname = '$DB_NAME'
    ORDER BY query_start DESC
    LIMIT 5;
" 2>/dev/null || echo "  Could not retrieve activity"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}Monitoring completed at $(date)${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
