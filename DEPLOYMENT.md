# Deployment Guide - Kroi Auto Center

## Pre-Deployment Checklist

- [ ] All images are in `/public/cars/` directory
- [ ] Environment variables configured (if using analytics/email)
- [ ] Test build runs successfully (`npm run build`)
- [ ] Contact information verified in code
- [ ] Social media links tested
- [ ] All car listings updated with current inventory

## Option 1: Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/kroi-auto-center.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables** (Optional)
   In Vercel project settings:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = Your Google Analytics ID
   - `SENDGRID_API_KEY` = Your SendGrid API key (if using email)

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `your-project.vercel.app`

5. **Custom Domain** (Optional)
   - Go to Settings → Domains
   - Add `kroiautocenter.fi`
   - Follow DNS configuration instructions

## Option 2: Netlify

### Steps:

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 or higher

2. **Deploy**
   ```bash
   npm install netlify-cli -g
   netlify login
   netlify init
   netlify deploy --prod
   ```

3. **Environment Variables**
   Add in Netlify dashboard under Site settings → Environment variables

## Option 3: Docker

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Deploy:

```bash
docker-compose up -d
```

## Option 4: VPS (Ubuntu/Debian)

### Requirements:
- Ubuntu 20.04+ or Debian 11+
- Node.js 18+
- Nginx
- PM2 (process manager)

### Steps:

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

3. **Upload and Build**
   ```bash
   cd /var/www
   git clone your-repo
   cd kroi-auto-center
   npm install
   npm run build
   ```

4. **Start with PM2**
   ```bash
   pm2 start npm --name "kroi-auto-center" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   Create `/etc/nginx/sites-available/kroiautocenter`:
   ```nginx
   server {
       listen 80;
       server_name kroiautocenter.fi www.kroiautocenter.fi;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/kroiautocenter /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

7. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d kroiautocenter.fi -d www.kroiautocenter.fi
   ```

## Post-Deployment

### 1. Verify Deployment
- [ ] Website loads correctly
- [ ] All images display
- [ ] Navigation works
- [ ] Contact form submits (check logs)
- [ ] WhatsApp links open correctly
- [ ] Mobile responsive design works
- [ ] Social media links work

### 2. SEO Setup
- [ ] Submit sitemap to Google Search Console: `https://kroiautocenter.fi/sitemap.xml`
- [ ] Verify robots.txt: `https://kroiautocenter.fi/robots.txt`
- [ ] Test structured data: [Google Rich Results Test](https://search.google.com/test/rich-results)

### 3. Analytics
- [ ] Verify Google Analytics tracking (if configured)
- [ ] Test form submissions reach inbox (if email configured)

### 4. Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test loading speed from different locations

### 5. Monitoring
```bash
# Check PM2 logs (if using PM2)
pm2 logs kroi-auto-center

# Check Next.js logs
# Logs location depends on deployment method
```

## Updating the Site

### Method 1: Git Push (Vercel/Netlify)
```bash
git add .
git commit -m "Update car listings"
git push
# Automatically deploys
```

### Method 2: VPS
```bash
cd /var/www/kroi-auto-center
git pull
npm install
npm run build
pm2 restart kroi-auto-center
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Images Not Loading
- Verify images are in `/public/cars/`
- Check file paths in `cars` array
- Ensure proper image formats (PNG, JPG, WebP)

### Form Not Working
- Check API route: `/api/contact`
- Verify CORS settings
- Check server logs for errors

### Performance Issues
- Enable image optimization
- Use CDN for static assets
- Enable caching headers in Nginx/server

## Support

For deployment issues:
- Check Next.js docs: https://nextjs.org/docs/deployment
- Vercel support: https://vercel.com/support
- GitHub Issues: Create an issue in your repository

---

Last updated: 2025-09-27