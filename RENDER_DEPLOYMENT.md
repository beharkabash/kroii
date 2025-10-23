# 🚀 Render Deployment Guide

## Quick Start

This project is configured for automatic deployment on Render using the included `render.yaml` file.

### Option 1: Deploy with render.yaml (Recommended) ✨

1. **Connect your GitHub repository** to Render
2. Render will automatically detect `render.yaml` and use these settings
3. **Update these values** in Render dashboard before deploying:
   - `NEXTAUTH_URL` → Your actual Render URL (e.g., `https://kroii-auto-center.onrender.com`)
   - Optionally add Sanity/Resend API keys if using those features

4. Click **"Manual Deploy"** or wait for auto-deploy on next push

### Option 2: Manual Configuration

If you prefer to configure manually without `render.yaml`:

#### Build Settings
```
Environment: Node
Branch: main
Build Command: cd kroi-auto-center && npm install && npm run build
Start Command: cd kroi-auto-center/.next/standalone/kroi-auto-center && node server.js
```

#### Environment Variables

**Required:**
```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=768
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.onrender.com
```

**Optional (for Sanity CMS):**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
```

**Optional (for Email):**
```
RESEND_API_KEY=your_resend_key
```

---

## Instance Type Recommendations

### Free Tier (512 MB RAM) - Testing/Staging
```yaml
plan: free
NODE_OPTIONS=--max-old-space-size=384
```
- ✅ Good for testing and low traffic
- ⚠️ May experience OOM under load
- ⚠️ Spins down after 15 min of inactivity

### Starter ($7/month, 1 GB RAM) - Recommended ⭐
```yaml
plan: starter
NODE_OPTIONS=--max-old-space-size=768
```
- ✅ Production-ready
- ✅ Handles traffic spikes
- ✅ Always on
- ✅ Comfortable memory headroom

### Standard ($15/month, 2 GB RAM) - High Traffic
```yaml
plan: standard
NODE_OPTIONS=--max-old-space-size=1536
```
- 🚀 For high-traffic sites
- 🚀 Enterprise-grade

---

## Files Added for Deployment

### 1. `render.yaml`
Infrastructure-as-code configuration for Render. Automatically configures your service.

### 2. `.nvmrc`
Specifies Node.js version (20.18.1) for consistent builds.

### 3. `.dockerignore`
Optimizes build by excluding unnecessary files.

### 4. `/app/api/health/route.ts`
Health check endpoint for monitoring. Returns:
- Server status
- Memory usage
- Uptime
- Environment info

Access at: `https://your-app.onrender.com/api/health`

---

## Deployment Checklist

- [ ] Repository connected to Render
- [ ] `render.yaml` detected by Render
- [ ] Update `NEXTAUTH_URL` in environment variables
- [ ] Generate and set `NEXTAUTH_SECRET`
- [ ] Choose instance type (recommend Starter)
- [ ] Enable auto-deploy (optional)
- [ ] Click "Manual Deploy"
- [ ] Monitor build logs
- [ ] Test health endpoint: `/api/health`
- [ ] Verify app is running

---

## Monitoring After Deployment

### Check Health Endpoint
```bash
curl https://your-app.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T...",
  "uptime": 123.45,
  "memory": {
    "used": 450,
    "total": 512,
    "rss": 500
  }
}
```

### Watch Memory Usage

In Render Metrics tab, monitor:
- **Memory usage** (should stay <80% of allocated)
- **Response times** (should be <500ms)
- **Error rates** (should be near 0%)

### Logs

Check for:
- ✅ "Server started successfully"
- ✅ "Listening on port 3000"
- ⚠️ Memory warnings
- ❌ OOM errors (upgrade if you see these)

---

## Troubleshooting

### Build Fails
```bash
# Check build command is correct
cd kroi-auto-center && npm install && npm run build
```

### App Won't Start
- Verify start command path
- Check `NODE_ENV=production` is set
- Review logs for errors

### Out of Memory Errors
- Upgrade to next tier
- Increase `NODE_OPTIONS` value
- Check for memory leaks in logs

### Slow Response Times
- Enable HTTP/2
- Check if images are optimized
- Consider CDN for static assets

---

## Custom Domain Setup

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `kroiautocenter.fi`)
3. Update DNS records:
   ```
   Type: CNAME
   Name: @ (or www)
   Value: <your-app>.onrender.com
   ```
4. Update `NEXTAUTH_URL` to your custom domain
5. Redeploy

---

## Cost Optimization

### Start with Free Tier
1. Deploy on free tier first
2. Monitor for 24-48 hours
3. Upgrade if needed

### Downgrade if Possible
If memory stays <350 MB consistently, you can use free tier!

---

## Security Checklist

- [x] `NEXTAUTH_SECRET` is randomly generated
- [x] `SANITY_API_TOKEN` marked as secret (not in logs)
- [x] HTTPS enabled by default
- [x] Security headers configured in `next.config.ts`
- [x] Environment variables not committed to git
- [ ] Add rate limiting for production (if needed)
- [ ] Set up monitoring alerts

---

## Support

- Render Docs: https://render.com/docs
- Health Check: `https://your-app.onrender.com/api/health`
- Build Logs: Render Dashboard → Logs tab
- Memory Analysis: See `MEMORY_ANALYSIS_2025.md`

---

**Last Updated:** October 23, 2025  
**Memory Optimized:** ✅ Fits in 512MB-1GB  
**Production Ready:** ✅
