# AWS Deployment Guide

Complete guide for deploying Kroi Auto Center to AWS with production-ready infrastructure.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                 CloudFront CDN                   │
│              (Global Distribution)               │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│          Application Load Balancer (ALB)         │
│              (SSL Termination)                   │
└─────────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
┌─────────▼──────────┐  ┌────────▼─────────┐
│   ECS Fargate      │  │   ECS Fargate    │
│   (Container 1)    │  │   (Container 2)  │
└────────────────────┘  └──────────────────┘
          │                       │
          └───────────┬───────────┘
                      │
┌─────────────────────────────────────────────────┐
│              RDS PostgreSQL                      │
│         (Multi-AZ, Automated Backups)            │
└─────────────────────────────────────────────────┘
```

## Prerequisites

- AWS Account
- AWS CLI configured
- Docker installed
- Terraform (optional, for IaC)

## Deployment Options

### Option 1: AWS Amplify (Easiest)

**Best for**: Simple deployments, automatic CI/CD

```bash
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configure Amplify
amplify init

# 3. Add hosting
amplify add hosting

# 4. Deploy
amplify push

# 5. Open app
amplify console
```

**Cost**: ~$15-50/month

### Option 2: ECS Fargate (Recommended)

**Best for**: Scalable production deployments

See detailed setup below.

**Cost**: ~$30-150/month

### Option 3: EC2 + Docker

**Best for**: Full control, custom configurations

See EC2 setup section below.

**Cost**: ~$20-100/month

### Option 4: AWS App Runner

**Best for**: Simplified container deployments

```bash
# Create App Runner service
aws apprunner create-service \
  --service-name kroi-auto-center \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "123456789.dkr.ecr.eu-north-1.amazonaws.com/kroi:latest",
      "ImageRepositoryType": "ECR"
    }
  }'
```

**Cost**: ~$25-80/month

## ECS Fargate Deployment (Detailed)

### 1. Prerequisites Setup

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Default region: eu-north-1
# Default output format: json

# Install ECS CLI
sudo curl -Lo /usr/local/bin/ecs-cli \
  https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest
sudo chmod +x /usr/local/bin/ecs-cli
```

### 2. Create ECR Repository

```bash
# Create repository
aws ecr create-repository \
  --repository-name kroi-auto-center \
  --region eu-north-1

# Get login token
aws ecr get-login-password --region eu-north-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.eu-north-1.amazonaws.com

# Build and push image
docker build -t kroi-auto-center .
docker tag kroi-auto-center:latest \
  123456789.dkr.ecr.eu-north-1.amazonaws.com/kroi-auto-center:latest
docker push 123456789.dkr.ecr.eu-north-1.amazonaws.com/kroi-auto-center:latest
```

### 3. Create RDS Database

```bash
# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name kroi-db-subnet \
  --db-subnet-group-description "Kroi Auto Center DB Subnet" \
  --subnet-ids subnet-xxx subnet-yyy

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier kroi-postgres \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 16.2 \
  --master-username kroiadmin \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --storage-type gp3 \
  --db-subnet-group-name kroi-db-subnet \
  --vpc-security-group-ids sg-xxx \
  --backup-retention-period 7 \
  --multi-az \
  --enable-cloudwatch-logs-exports '["postgresql"]' \
  --tags Key=Project,Value=KroiAutoCenter
```

### 4. Create ElastiCache (Redis)

```bash
# Create cache subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name kroi-cache-subnet \
  --cache-subnet-group-description "Kroi Auto Center Cache Subnet" \
  --subnet-ids subnet-xxx subnet-yyy

# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id kroi-redis \
  --engine redis \
  --engine-version 7.0 \
  --cache-node-type cache.t4g.micro \
  --num-cache-nodes 1 \
  --cache-subnet-group-name kroi-cache-subnet \
  --security-group-ids sg-xxx \
  --tags Key=Project,Value=KroiAutoCenter
```

### 5. Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster \
  --cluster-name kroi-cluster \
  --capacity-providers FARGATE FARGATE_SPOT \
  --tags key=Project,value=KroiAutoCenter

# Create task execution role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://task-execution-role.json

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### 6. Create Task Definition

Create `task-definition.json`:

```json
{
  "family": "kroi-auto-center",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "kroi-app",
      "image": "123456789.dkr.ecr.eu-north-1.amazonaws.com/kroi-auto-center:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:eu-north-1:123456789:secret:kroi/database-url"
        },
        {
          "name": "REDIS_URL",
          "valueFrom": "arn:aws:secretsmanager:eu-north-1:123456789:secret:kroi/redis-url"
        },
        {
          "name": "RESEND_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:eu-north-1:123456789:secret:kroi/resend-api-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/kroi-auto-center",
          "awslogs-region": "eu-north-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register task definition:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 7. Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name kroi-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx \
  --scheme internet-facing \
  --type application \
  --tags Key=Project,Value=KroiAutoCenter

# Create target group
aws elbv2 create-target-group \
  --name kroi-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx \
  --target-type ip \
  --health-check-enabled \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

### 8. Create ECS Service

```bash
aws ecs create-service \
  --cluster kroi-cluster \
  --service-name kroi-service \
  --task-definition kroi-auto-center:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration '{
    "awsvpcConfiguration": {
      "subnets": ["subnet-xxx", "subnet-yyy"],
      "securityGroups": ["sg-xxx"],
      "assignPublicIp": "DISABLED"
    }
  }' \
  --load-balancers '[
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:...",
      "containerName": "kroi-app",
      "containerPort": 3000
    }
  ]' \
  --deployment-configuration '{
    "maximumPercent": 200,
    "minimumHealthyPercent": 100,
    "deploymentCircuitBreaker": {
      "enable": true,
      "rollback": true
    }
  }'
```

### 9. Setup CloudFront CDN

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name kroi-alb-xxx.eu-north-1.elb.amazonaws.com \
  --default-root-object index.html
```

### 10. Configure Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/kroi-cluster/kroi-service \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/kroi-cluster/kroi-service \
  --policy-name kroi-cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleOutCooldown": 60,
    "ScaleInCooldown": 300
  }'
```

## EC2 Deployment

### 1. Launch EC2 Instance

```bash
# Create security group
aws ec2 create-security-group \
  --group-name kroi-sg \
  --description "Kroi Auto Center Security Group"

# Add rules
aws ec2 authorize-security-group-ingress \
  --group-name kroi-sg \
  --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --group-name kroi-sg \
  --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --group-name kroi-sg \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# Launch instance
aws ec2 run-instances \
  --image-id ami-xxx \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxx \
  --subnet-id subnet-xxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=kroi-auto-center}]'
```

### 2. Setup Server

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@ec2-xxx.compute.amazonaws.com

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker ubuntu

# Clone repository
git clone https://github.com/yourusername/kroi-auto-center.git
cd kroi-auto-center

# Configure environment
cp .env.example .env.production
nano .env.production

# Deploy
docker-compose up -d
```

## AWS Secrets Manager

```bash
# Store secrets
aws secretsmanager create-secret \
  --name kroi/database-url \
  --secret-string "postgresql://user:pass@host:5432/db"

aws secretsmanager create-secret \
  --name kroi/resend-api-key \
  --secret-string "re_xxxxxxxxxxxx"

# Retrieve secrets
aws secretsmanager get-secret-value \
  --secret-id kroi/database-url \
  --query SecretString --output text
```

## Monitoring & Logging

### CloudWatch Logs

```bash
# Create log group
aws logs create-log-group --log-group-name /ecs/kroi-auto-center

# View logs
aws logs tail /ecs/kroi-auto-center --follow
```

### CloudWatch Alarms

```bash
# CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name kroi-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## Backup Strategy

### RDS Automated Backups

```bash
# Enable automated backups
aws rds modify-db-instance \
  --db-instance-identifier kroi-postgres \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00"

# Create manual snapshot
aws rds create-db-snapshot \
  --db-snapshot-identifier kroi-snapshot-$(date +%Y%m%d) \
  --db-instance-identifier kroi-postgres
```

### S3 Backup

```bash
# Create S3 bucket
aws s3 mb s3://kroi-auto-center-backups

# Upload backups
aws s3 sync /var/backups/kroi s3://kroi-auto-center-backups/
```

## Cost Optimization

1. **Use Fargate Spot** - 70% savings
2. **Reserved Instances** - 30-60% savings (for stable workloads)
3. **S3 Intelligent-Tiering** - Automatic cost optimization
4. **CloudFront** - Reduce origin load
5. **RDS Read Replicas** - Scale reads efficiently

### Cost Estimation

- **ECS Fargate**: $30/month (2 tasks)
- **RDS t4g.micro**: $15/month
- **ElastiCache**: $12/month
- **ALB**: $16/month
- **CloudFront**: $5-20/month
- **S3**: $1-5/month
- **Total**: ~$80-100/month

## Security Best Practices

1. **VPC Configuration**
   - Private subnets for containers
   - NAT Gateway for outbound traffic
   - Security groups with minimal access

2. **IAM Roles**
   - Task execution role (ECR, logs)
   - Task role (S3, Secrets Manager)
   - Least privilege principle

3. **Secrets Management**
   - Use AWS Secrets Manager
   - Rotate credentials regularly
   - Enable encryption at rest

4. **Network Security**
   - Enable VPC Flow Logs
   - Use WAF for ALB
   - Enable Shield Standard (free DDoS protection)

## Deployment Checklist

- [ ] ECR repository created
- [ ] RDS database provisioned
- [ ] ElastiCache configured
- [ ] ECS cluster created
- [ ] Task definition registered
- [ ] ALB configured with SSL
- [ ] CloudFront distribution setup
- [ ] Auto scaling enabled
- [ ] CloudWatch alarms configured
- [ ] Backups automated
- [ ] Secrets stored in Secrets Manager
- [ ] CI/CD pipeline setup
- [ ] DNS configured
- [ ] Security groups reviewed
- [ ] Cost alerts enabled

## Support & Resources

- **AWS Documentation**: https://docs.aws.amazon.com
- **ECS Best Practices**: https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide
- **AWS Support**: https://console.aws.amazon.com/support