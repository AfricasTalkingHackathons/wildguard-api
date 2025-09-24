# 🚀 WildGuard API - Render Deployment Guide

## Quick Deploy to Render

### 1. Prerequisites
- ✅ GitHub repository pushed (already done!)
- ✅ Render account (sign up at [render.com](https://render.com))
- ✅ Production database (Neon PostgreSQL - already configured!)

### 2. One-Click Deploy Button

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AfricasTalkingHackathons/wildguard-api)

### 3. Manual Deployment Steps

#### Option A: One-Click with render.yaml (Recommended)
1. Your repository includes a `render.yaml` file for automatic configuration
2. Simply connect the repository and Render will use the configuration
3. You only need to set the secure environment variables manually

#### Option B: Manual Configuration

#### Step 1: Create New Web Service
1. Log into [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select repository: `AfricasTalkingHackathons/wildguard-api`
5. Choose branch: `main`

#### Step 2: Configure Service Settings
```
Name: wildguard-api
Runtime: Docker
Region: Oregon (US West) or nearest to your users
Branch: main
Build Command: (auto-detected from Dockerfile)
Start Command: (auto-detected from Dockerfile)
```

**🐳 Docker Advantage**: Render automatically detects your Dockerfile and uses it for deployment - no need to configure build/start commands!

#### Step 3: Set Environment Variables
**Required Environment Variables:**
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=your_neon_database_url
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=your_africas_talking_username
JWT_SECRET=your_secure_jwt_secret_from_env_production
```

**Optional Environment Variables:**
```bash
USSD_CODE=*123#
SMS_SENDER_ID=WildGuard
REDIS_URL=your_redis_url_if_needed
SLACK_WEBHOOK_URL=your_slack_webhook
DISCORD_WEBHOOK_URL=your_discord_webhook
```

#### Step 4: Advanced Settings
- **Auto-Deploy**: Enabled (deploys automatically on git push)
- **Health Check Path**: `/health`
- **Instance Type**: Starter (can upgrade later)

### 4. Environment Variables Setup

#### Copy from your existing files:
```bash
# Production Environment Variables for Render
NODE_ENV=production
PORT=10000  # Render uses this port

# Your existing Neon database (production ready)
DATABASE_URL=postgresql://neondb_owner:npg_shF9rKz5eHAZ@ep-patient-bush-ag36m0ou.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require

# Your Africa's Talking credentials
AT_API_KEY=atsk_399d2acd2d6d11b29fec0289695b0ce9e88a29d261e25d9f0bb778536c9504ac4357b70b
AT_USERNAME=SafeB

# Your production JWT secret (already generated)
JWT_SECRET=1f4861391fb79b69f9fa4dbe2107a7fe7fcc6c39b40601c817061b260a6ba860afddc7d0c98e47a28a6d364a6421f09621cd77e538df17d4d61209ddb6b89bd9
```

**🔐 Security Note**: These are your actual production credentials. In Render, add them one by one in the Environment Variables section - never expose them publicly!

### 5. Docker-Based Deployment Benefits

#### Automatic Detection
- ✅ Render automatically detects your `Dockerfile`
- ✅ No manual build/start commands needed
- ✅ Consistent environment across development and production
- ✅ Faster deployments with Docker layer caching

#### Your Docker Configuration
Your existing `Dockerfile` is production-ready with:
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder
FROM node:18-alpine AS production

# Optimized for Render deployment
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### 6. Post-Deployment Setup

#### Run Database Migrations
After deployment, access the Render shell to run migrations:
```bash
# Access via Render Dashboard → Your Service → Shell
npm run db:migrate
npm run db:seed
```

**🐳 Docker Shell Access**: In Render dashboard, you can access your container's shell to run these commands directly inside your Docker environment.

#### Verify Deployment
1. Check the deployment URL (your service will be at something like: `https://wildguard-api-xxxxxxx.onrender.com`)
2. **Test core endpoints**:
   ```bash
   # Replace with your actual Render URL
   export API_URL="https://wildguard-api-xxxxxxx.onrender.com"
   
   # Health check
   curl $API_URL/health
   
   # API documentation
   curl $API_URL/api/docs
   
   # Test seeded user profile
   curl "$API_URL/api/community/profile/%2B254712345678"
   
   # Sensor network status
   curl $API_URL/api/sensors/network
   ```

3. **Expected Responses**:
   ```json
   // Health check should return:
   {"status": "healthy", "timestamp": "...", "environment": "production"}
   
   // User profile should show:
   {"phoneNumber": "+254712345678", "trustScore": 85, "totalReports": 1, ...}
   
   // Sensor network should show:
   {"success": true, "overview": {"totalSensors": 2, "activeSensors": 2, ...}}
   ```

### 6. Custom Domain (Optional)
1. In Render Dashboard → Settings → Custom Domains
2. Add your domain: `api.wildguard.africa`
3. Configure DNS CNAME to point to your Render URL

### 7. Monitoring & Logs
- **Logs**: Available in Render Dashboard → Logs
- **Metrics**: Built-in CPU, memory, and response time monitoring
- **Alerts**: Set up in Settings → Notifications

### 8. Docker Deployment Advantages

#### Why Docker on Render?
- **Consistency**: Same environment locally and in production
- **Speed**: Docker layer caching speeds up deployments
- **Isolation**: Complete environment isolation
- **Simplicity**: No build command configuration needed

#### Container Health
Your Docker container includes:
```dockerfile
# Health check built into your container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

#### Auto-Scaling
- Render automatically scales your Docker containers
- No configuration needed - works out of the box
- Load balancing handled automatically

### 9. Production Optimizations

#### Performance Settings
```yaml
# In render.yaml
plan: starter  # or standard/pro for more resources
healthCheckPath: /health
autoDeploy: true
```

#### Database Optimization
- Neon database connection pooling is already configured
- Consider upgrading Neon plan for higher throughput

#### Caching (Optional)
Add Redis for caching:
```bash
# Add to environment variables
REDIS_URL=redis://your-redis-instance
```

### 9. Scaling Options
- **Horizontal**: Render auto-scales based on traffic
- **Vertical**: Upgrade instance type in dashboard
- **Geographic**: Deploy to multiple regions

### 10. Security Checklist
- ✅ Environment variables configured
- ✅ Database SSL enabled (Neon default)
- ✅ HTTPS enforced (Render default)
- ✅ Rate limiting configured
- ✅ Input validation active
- ✅ Security headers enabled

### 11. Troubleshooting

#### Common Issues:
```bash
# Build fails
Solution: Check package.json scripts and dependencies

# Database connection error
Solution: Verify DATABASE_URL format and SSL settings

# Environment variables missing
Solution: Double-check all required variables in Render settings

# Health check fails
Solution: Ensure /health endpoint is accessible
```

#### Debug Commands:
```bash
# Check environment
echo $NODE_ENV
echo $DATABASE_URL

# Test database connection
npm run db:migrate

# Verify build
npm run build && npm run start:prod
```

### 12. Cost Optimization
- **Starter Plan**: $0-7/month (perfect for development/small scale)
- **Standard Plan**: $25/month (production ready)
- **Pro Plan**: $85/month (high performance)

### 13. Backup & Recovery
- Database: Neon provides automatic backups
- Code: GitHub repository serves as backup
- Environment: Export variables from Render dashboard

## 🎉 Deployment Complete!

Your WildGuard API will be live at:
`https://wildguard-api.onrender.com`

**Next Steps:**
1. Test all API endpoints
2. Configure webhooks with your deployed URL
3. Update frontend to use production API URL
4. Set up monitoring and alerts
5. Configure custom domain if needed

## 📞 Support
- Render Support: [help.render.com](https://help.render.com)
- WildGuard Issues: [GitHub Issues](https://github.com/AfricasTalkingHackathons/wildguard-api/issues)