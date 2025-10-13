# 🚀 Render Deployment Checklist - KROI AUTO CENTER

## ✅ Pre-Deployment Status
- [x] **TypeScript errors fixed** - All compilation errors resolved
- [x] **ESLint warnings reduced** - From 27+ to 9 warnings (non-blocking)
- [x] **Build configuration updated** - Strict checking enabled
- [ ] **Environment variables configured** - Ready to set in Render
- [ ] **Deployment monitoring** - Ready to deploy and monitor

## 🔧 Required Environment Variables for Render Dashboard

Copy and paste these variables into your Render Dashboard > Environment Variables:

### 🌐 Core Application
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SITE_URL=https://kroiautocenter.fi
NEXT_PUBLIC_APP_NAME=Kroi Auto Center
```

### 🔑 Security & Authentication
```
NEXTAUTH_SECRET=<GENERATE_32_CHAR_SECRET>
NEXTAUTH_URL=https://kroiautocenter.fi
JWT_SECRET=<GENERATE_32_CHAR_SECRET>
WEBHOOK_SECRET=<GENERATE_32_CHAR_SECRET>
```

### 📧 Email Configuration (Required)
**Option 1: Gmail SMTP (Recommended)**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=kroiautocenter@gmail.com
SMTP_PASS=<YOUR_GMAIL_APP_PASSWORD>
SMTP_FROM=noreply@kroiautocenter.fi
SMTP_FROM_NAME=Kroi Auto Center
CONTACT_EMAIL=kroiautocenter@gmail.com
```

**Option 2: Resend.com (Alternative)**
```
RESEND_API_KEY=re_<YOUR_RESEND_API_KEY>
```

### 📊 Analytics & Monitoring (Optional)
```
NEXT_PUBLIC_GA_ID=G-<YOUR_GOOGLE_ANALYTICS_ID>
SENTRY_DSN=https://<YOUR_SENTRY_DSN>@sentry.io/<PROJECT_ID>
NEXT_PUBLIC_SENTRY_DSN=https://<YOUR_SENTRY_DSN>@sentry.io/<PROJECT_ID>
```

### 💬 Communication (Optional)
```
WHATSAPP_PHONE_NUMBER=+358413188214
BUSINESS_PHONE=+358413188214
BUSINESS_EMAIL=info@kroiautocenter.fi
BUSINESS_ADDRESS=Helsinki, Finland
```

### 🔒 Security & Performance
```
CORS_ORIGINS=https://kroiautocenter.fi,https://www.kroiautocenter.fi
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📋 Render Service Configuration

### Web Service Settings:
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`
- **Node Version:** 18.x or 20.x
- **Region:** Frankfurt (closest to your target audience)
- **Instance Type:** Starter (can upgrade later)

### Required Add-ons:
1. **PostgreSQL Database** (Free tier available)
   - Will auto-generate `DATABASE_URL`
2. **Redis Cache** (Free tier available)
   - Will auto-generate `REDIS_URL`

## 🔐 Secret Generation

Generate secure secrets for authentication:

```bash
# For NEXTAUTH_SECRET
openssl rand -base64 32

# For JWT_SECRET
openssl rand -base64 32

# For WEBHOOK_SECRET
openssl rand -base64 32
```

## 📧 Email Setup Steps

### Gmail SMTP Setup:
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character app password as `SMTP_PASS`

### Resend.com Setup:
1. Sign up at https://resend.com
2. Add your domain for verification
3. Get API key from dashboard

## 🚀 Deployment Steps

1. **Create Render Services:**
   - PostgreSQL Database
   - Redis Cache
   - Web Service (this application)

2. **Configure Environment Variables:**
   - Copy all required variables above
   - Generate secure secrets
   - Set up email service credentials

3. **Deploy:**
   - Connect GitHub repository
   - Set build/start commands
   - Deploy and monitor logs

4. **Post-Deployment Verification:**
   - Test health endpoint: `/api/health`
   - Verify email functionality
   - Check database connection
   - Test car listings

## 🔍 Health Check

After deployment, verify these endpoints:
- `https://kroiautocenter.fi/api/health` - Should return 200 OK
- `https://kroiautocenter.fi/cars` - Should show car listings
- `https://kroiautocenter.fi` - Home page loads correctly

## 🚨 Common Issues & Solutions

**Build fails with TypeScript errors:**
✅ Fixed - All TypeScript errors resolved

**Build fails with ESLint warnings:**
✅ Improved - Reduced from 27+ to 9 non-blocking warnings

**Database connection fails:**
- Verify `DATABASE_URL` is set by PostgreSQL add-on
- Check database connection in health endpoint

**Email not working:**
- Verify SMTP credentials
- Check Gmail app password setup
- Test with contact form

**Redis connection fails:**
- Verify `REDIS_URL` is set by Redis add-on
- Cache will fallback to memory if Redis unavailable

## ✅ Ready for Deployment!

All critical issues have been resolved:
- ✅ TypeScript compilation successful
- ✅ Build configuration optimized
- ✅ ESLint warnings minimized (9 remaining, non-blocking)
- ✅ Environment variables documented
- ✅ Deployment guide prepared

Your Kroi Auto Center application is production-ready for Render deployment!