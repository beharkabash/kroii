# Docker Deployment Guide

Complete guide for deploying Kroi Auto Center using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB RAM minimum
- 20GB disk space

## Quick Start

### Local Development

```bash
# Start development services (PostgreSQL + Redis)
npm run docker:dev

# Or manually
docker-compose -f docker-compose.dev.yml up -d

# Run the app
npm run dev

# Stop services
npm run docker:dev:stop
```

### Production Deployment

```bash
# 1. Configure environment
cp .env.example .env.production
# Edit .env.production with your values

# 2. Build and start
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f app
```

## Docker Images

### Building Images

```bash
# Build production image
docker build -t kroi-auto-center:latest .

# Build with specific tag
docker build -t kroi-auto-center:v1.0.0 .

# Build for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 \
  -t kroi-auto-center:latest .
```

### Image Optimization

Our multi-stage build produces optimized images:

- **Builder Stage**: ~1.2GB (discarded)
- **Production Stage**: ~200MB
- **Gzip Compressed**: ~80MB

### Pre-built Images

```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/yourusername/kroi-auto-center:latest

# Run pre-built image
docker run -d -p 3000:3000 \
  --env-file .env.production \
  ghcr.io/yourusername/kroi-auto-center:latest
```

## Docker Compose Configurations

### Production Stack

```yaml
# docker-compose.yml
services:
  postgres:    # PostgreSQL database
  redis:       # Redis cache
  app:         # Next.js application
  nginx:       # Reverse proxy (optional)
```

### Development Stack

```yaml
# docker-compose.dev.yml
services:
  postgres:    # Development database
  redis:       # Development cache
```

## Environment Variables

### Required Variables

```env
# Application
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://kroi:password@postgres:5432/kroi_auto_center
REDIS_URL=redis://redis:6379

# External Services
RESEND_API_KEY=your_key
SENTRY_DSN=your_dsn
NEXTAUTH_SECRET=your_secret
```

### Docker-Specific Variables

```env
# Container Configuration
POSTGRES_USER=kroi
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=kroi_auto_center
REDIS_PASSWORD=secure_password

# Backup Configuration
BACKUP_DIR=/var/backups/kroi-auto-center
RETENTION_DAYS=30
AWS_S3_BUCKET=your-bucket-name
```

## Network Configuration

### Default Network

```bash
# Network: kroi-network (bridge)
# Containers can communicate using service names
# Example: postgres:5432, redis:6379
```

### Custom Network

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No internet access
```

## Volume Management

### Data Persistence

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect kroi-auto-center_postgres_data

# Backup volume
docker run --rm -v kroi-auto-center_postgres_data:/data \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/postgres_backup.tar.gz /data

# Restore volume
docker run --rm -v kroi-auto-center_postgres_data:/data \
  -v $(pwd)/backup:/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

### Volume Backup Script

```bash
#!/bin/bash
# Backup all Docker volumes
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

docker-compose down
docker run --rm \
  -v kroi-auto-center_postgres_data:/source/postgres \
  -v kroi-auto-center_redis_data:/source/redis \
  -v "$BACKUP_DIR":/backup \
  alpine tar czf /backup/volumes_backup.tar.gz /source
docker-compose up -d
```

## Health Checks

### Application Health

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' kroi-auto-center

# View health logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' kroi-auto-center

# Manual health check
curl http://localhost:3000/api/health
```

### Database Health

```bash
# PostgreSQL health
docker exec kroi-postgres pg_isready -U kroi

# Redis health
docker exec kroi-redis redis-cli ping
```

## Logging

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app

# Follow logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# Timestamps
docker-compose logs -t app
```

### Log Configuration

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
    compress: "true"
```

### Centralized Logging

```yaml
logging:
  driver: "syslog"
  options:
    syslog-address: "tcp://logs.example.com:514"
    tag: "kroi-auto-center"
```

## Scaling

### Horizontal Scaling

```bash
# Scale application instances
docker-compose up -d --scale app=3

# With load balancer
docker-compose -f docker-compose.yml \
  -f docker-compose.scale.yml up -d
```

### Load Balancing

```nginx
# nginx.conf
upstream app {
  server app_1:3000;
  server app_2:3000;
  server app_3:3000;
}
```

## Security

### Running as Non-Root

```dockerfile
# Already configured in Dockerfile
USER nextjs
```

### Secrets Management

```bash
# Use Docker secrets
docker secret create postgres_password ./postgres_password.txt

# In docker-compose.yml
secrets:
  postgres_password:
    external: true
```

### Network Isolation

```yaml
services:
  app:
    networks:
      - frontend
      - backend
  postgres:
    networks:
      - backend  # Not exposed to internet
```

## Deployment to Production

### VPS Deployment (DigitalOcean, Linode, etc.)

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Clone repository
git clone https://github.com/yourusername/kroi-auto-center.git
cd kroi-auto-center

# 4. Configure environment
cp .env.example .env.production
nano .env.production

# 5. Deploy
docker-compose up -d

# 6. Setup SSL (with nginx)
./scripts/setup-ssl.sh kroiautocenter.fi
```

### AWS ECS Deployment

```bash
# 1. Push image to ECR
aws ecr get-login-password --region eu-north-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.eu-north-1.amazonaws.com

docker tag kroi-auto-center:latest \
  123456789.dkr.ecr.eu-north-1.amazonaws.com/kroi-auto-center:latest

docker push 123456789.dkr.ecr.eu-north-1.amazonaws.com/kroi-auto-center:latest

# 2. Create ECS task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# 3. Update service
aws ecs update-service --cluster kroi-cluster \
  --service kroi-service \
  --task-definition kroi-auto-center:1
```

### Docker Swarm Deployment

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml kroi

# Scale service
docker service scale kroi_app=3

# Update service
docker service update --image kroi-auto-center:v2 kroi_app
```

## Monitoring

### Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats kroi-auto-center

# JSON format
docker stats --no-stream --format "{{json .}}" | jq
```

### Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Backup & Recovery

### Automated Backups

```bash
# Add to crontab
0 2 * * * cd /opt/kroi-auto-center && ./scripts/backup/backup-database.sh

# Or use systemd timer
systemctl enable kroi-backup.timer
systemctl start kroi-backup.timer
```

### Disaster Recovery

```bash
# 1. Stop services
docker-compose down

# 2. Restore volumes
docker volume create kroi-auto-center_postgres_data
docker run --rm \
  -v kroi-auto-center_postgres_data:/data \
  -v $(pwd)/backup:/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /

# 3. Start services
docker-compose up -d

# 4. Verify
curl http://localhost:3000/api/health
```

## Troubleshooting

### Common Issues

```bash
# Container won't start
docker-compose logs app
docker inspect kroi-auto-center

# Permission denied
sudo chown -R 1001:1001 /path/to/volumes

# Port already in use
sudo lsof -i :3000
docker-compose down

# Out of disk space
docker system prune -a
docker volume prune
```

### Debug Mode

```bash
# Run with debug output
docker-compose --verbose up

# Interactive shell
docker exec -it kroi-auto-center sh

# Check environment
docker exec kroi-auto-center env
```

## Maintenance

### Updates

```bash
# 1. Backup
./scripts/backup/backup-database.sh

# 2. Pull latest code
git pull origin main

# 3. Rebuild
docker-compose build --no-cache

# 4. Deploy
docker-compose up -d

# 5. Verify
curl http://localhost:3000/api/health
```

### Cleanup

```bash
# Remove stopped containers
docker-compose down

# Remove images
docker image prune -a

# Remove volumes (CAUTION!)
docker volume prune

# Full cleanup
docker system prune -a --volumes
```

## Performance Tuning

### Build Cache

```bash
# Use buildkit
DOCKER_BUILDKIT=1 docker build -t kroi-auto-center .

# Cache from registry
docker build --cache-from ghcr.io/yourusername/kroi-auto-center:latest .
```

### Runtime Optimization

```yaml
services:
  app:
    # Use host network for better performance
    network_mode: "host"

    # Memory optimization
    environment:
      NODE_OPTIONS: "--max-old-space-size=2048"
```

## Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Health checks enabled
- [ ] Logging configured
- [ ] Backups automated
- [ ] Monitoring setup (Sentry, Grafana)
- [ ] Resource limits set
- [ ] Security hardening applied
- [ ] Documentation updated
- [ ] Rollback plan tested

## Support & Resources

- **Docker Documentation**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose
- **Best Practices**: https://docs.docker.com/develop/dev-best-practices
- **Security**: https://docs.docker.com/engine/security