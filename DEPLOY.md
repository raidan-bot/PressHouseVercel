# PressHouse Vercel - Deployment Guide

## 🚀 Quick Deploy

### Option 1: Vercel Dashboard (Recommended)

1. **Fork Repository**
   ```bash
   git clone https://github.com/press-house/ph-ye.org.git
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import from GitHub
   - Select `press-house/ph-ye.org`

3. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 3: GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🔧 Post-Deployment Setup

### 1. Configure Domain

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add custom domain: `ph-ye.org`
3. Update DNS records as instructed

### 2. Set Up Webhook (Telegram)

```bash
# Set webhook URL
curl -X POST \
  https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook \
  -d "url=https://ph-ye.org/api/telegram"
```

### 3. Verify Deployment

```bash
# Check health endpoint
curl https://ph-ye.org/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-07-01T..."}
```

## 🔄 Continuous Deployment

### Auto-Deploy on Push

Vercel automatically deploys on every push to main branch.

### Preview Deployments

Every Pull Request gets a preview URL:
- `https://ph-ye-org-git-branch-name.vercel.app`

### Production Deployments

Only deploy to production when ready:
- Merge to `main` branch
- Or manually promote preview deployment

## 🛠️ Troubleshooting

### Build Failures

1. Check build logs in Vercel Dashboard
2. Verify all environment variables are set
3. Ensure `package.json` scripts are correct

### Runtime Errors

1. Check function logs in Vercel Dashboard
2. Verify database connections
3. Check API endpoint responses

### Common Issues

| Issue | Solution |
|-------|----------|
| Build timeout | Increase function timeout in `vercel.json` |
| Memory limit | Optimize code or increase memory |
| Cold starts | Use Edge functions or optimize code |

## 📊 Monitoring

### Vercel Analytics

Enable in Dashboard → Analytics

### Custom Monitoring

```bash
# Check logs
vercel logs --all

# Real-time logs
vercel logs --follow
```

## 🔒 Security Checklist

- [ ] All secrets in environment variables
- [ ] JWT secret is strong
- [ ] Database credentials are secure
- [ ] API keys are restricted
- [ ] HTTPS only
- [ ] Security headers enabled

## 📞 Support

For deployment issues:
- Check [Vercel Docs](https://vercel.com/docs)
- Open GitHub Issue
- Contact: support@ph-ye.org
