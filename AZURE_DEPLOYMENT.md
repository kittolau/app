# Azure App Service Deployment Guide

## Overview

This guide covers deploying your AR app to Azure App Service with production-grade compression and optimization.

## Deployment Options

### Option 1: Node.js App Service (Recommended) ⭐
- Uses `server.js` with Express
- Built-in gzip compression (25-30% size reduction)
- Full control over server behavior
- **Best for**: Dynamic apps, need server-side logic

### Option 2: Static Web App
- Azure manages compression (Brotli + Gzip)
- Automatic CDN
- Free SSL
- **Best for**: Pure static content

### Option 3: App Service + Static Files
- Uses IIS with `web.config`
- Server-level compression
- **Best for**: Simple deployment

## Option 1: Node.js App Service (Recommended)

### Prerequisites
```bash
# Install Azure CLI
brew install azure-cli  # macOS
# or download from: https://aka.ms/installazurecliwindows

# Login
az login
```

### Step 1: Prepare the App

Your app is already ready! It includes:
- ✅ `server.js` - Production server with compression
- ✅ `package.json` - Dependencies configured
- ✅ `web.config` - IIS configuration (fallback)

### Step 2: Create Azure Resources

```bash
# Set variables
RESOURCE_GROUP="kitto-app-rg"
APP_SERVICE_PLAN="kitto-app-plan"
APP_NAME="kitto-ar-app"  # Must be globally unique
LOCATION="eastus"

# Create resource group
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Create App Service Plan (Free tier for testing)
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku F1 \
  --is-linux

# Or for production (B1 tier - recommended)
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App with Node.js 18
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $APP_NAME \
  --runtime "NODE:18-lts"
```

### Step 3: Configure the App

```bash
# Set Node.js version
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings WEBSITE_NODE_DEFAULT_VERSION="~18"

# Set startup command
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --startup-file "server.js"

# Set environment to production
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings NODE_ENV="production"

# Enable application logging
az webapp log config \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --application-logging filesystem \
  --level information
```

### Step 4: Deploy

#### Method A: ZIP Deploy (Easiest)

```bash
# 1. Create deployment package (excludes node_modules, .git, etc.)
zip -r kitto-app.zip . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "*.original.glb" \
  -x ".DS_Store" \
  -x "compress-*.js" \
  -x "*.md"

# 2. Deploy
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src kitto-app.zip

# 3. Wait for deployment (2-5 minutes)
echo "Deploying... check https://$APP_NAME.azurewebsites.net"
```

#### Method B: Git Deploy

```bash
# 1. Get deployment credentials
DEPLOY_USER=$(az webapp deployment list-publishing-credentials \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --query publishingUserName -o tsv)

DEPLOY_PASS=$(az webapp deployment list-publishing-credentials \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --query publishingPassword -o tsv)

# 2. Get Git URL
GIT_URL=$(az webapp deployment source config-local-git \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --query url -o tsv)

# 3. Add remote and push
git remote add azure $GIT_URL
git push azure main
```

#### Method C: GitHub Actions (CI/CD)

```bash
# Enable GitHub Actions deployment
az webapp deployment github-actions add \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --repo "your-username/kitto-app" \
  --branch main \
  --login-with-github
```

### Step 5: Verify Deployment

```bash
# Get app URL
APP_URL="https://$APP_NAME.azurewebsites.net"
echo "App URL: $APP_URL"

# Test
curl -I $APP_URL

# Check logs
az webapp log tail \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME
```

### Step 6: Test Compression

```bash
# Test gzip compression
curl -H "Accept-Encoding: gzip" -I \
  https://$APP_NAME.azurewebsites.net/app/ar_app/model/sputnik1/sputnik1.glb

# Look for these headers:
# Content-Encoding: gzip
# Content-Type: model/gltf-binary
# Vary: Accept-Encoding
```

## Option 2: Azure Static Web Apps

### Benefits
- Free tier available
- Built-in CDN
- Automatic Brotli + Gzip compression
- Free SSL
- GitHub/GitLab integration

### Deployment

```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Login
az login

# Create static web app
az staticwebapp create \
  --name kitto-static-app \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/your-username/kitto-app \
  --location "eastus2" \
  --branch main \
  --app-location "/" \
  --output-location "." \
  --sku Free

# Get deployment token
az staticwebapp secrets list \
  --name kitto-static-app \
  --query "properties.apiKey" -o tsv
```

### Create `staticwebapp.config.json`

```json
{
  "routes": [
    {
      "route": "/app/*",
      "rewrite": "/app/index.html"
    }
  ],
  "mimeTypes": {
    ".glb": "model/gltf-binary",
    ".gltf": "model/gltf+json",
    ".patt": "text/plain"
  },
  "globalHeaders": {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=31536000, immutable"
  },
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/app/*", "/asset/*", "/demo/*"]
  }
}
```

## Post-Deployment Configuration

### Custom Domain

```bash
# Add custom domain
az webapp config hostname add \
  --resource-group $RESOURCE_GROUP \
  --webapp-name $APP_NAME \
  --hostname "ar.yourdomain.com"

# Enable HTTPS
az webapp update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --https-only true
```

### SSL Certificate

```bash
# Free SSL with App Service Managed Certificate
az webapp config ssl create \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --hostname "ar.yourdomain.com"

# Or use Let's Encrypt (free)
# Or upload your own certificate
```

### Scale Up (If Needed)

```bash
# Scale to Premium tier for more power
az appservice plan update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_PLAN \
  --sku P1V2
```

### Enable Azure Front Door (CDN + Brotli)

```bash
# Create Front Door for global CDN
az network front-door create \
  --resource-group $RESOURCE_GROUP \
  --name kitto-frontdoor \
  --backend-address $APP_NAME.azurewebsites.net \
  --accepted-protocols Http Https \
  --forwarding-protocol HttpsOnly

# Front Door provides:
# - Global CDN
# - Brotli compression
# - DDoS protection
# - WAF (firewall)
```

## Performance Optimization

### Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app kitto-insights \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP

# Link to Web App
APP_INSIGHTS_KEY=$(az monitor app-insights component show \
  --app kitto-insights \
  --resource-group $RESOURCE_GROUP \
  --query instrumentationKey -o tsv)

az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="$APP_INSIGHTS_KEY"
```

### Performance Monitoring

Access metrics at:
```
https://portal.azure.com
→ Resource Group: kitto-app-rg
→ App Service: kitto-ar-app
→ Metrics
```

Monitor:
- Response time
- Request count
- CPU/Memory usage
- Bandwidth usage

## Cost Estimation

### Free Tier (F1)
- **Cost**: $0/month
- **Limitations**: 
  - 60 CPU minutes/day
  - 1 GB storage
  - Custom domains not supported
- **Best for**: Testing

### Basic Tier (B1)
- **Cost**: ~$13/month
- **Includes**:
  - Unlimited CPU
  - 10 GB storage
  - Custom domains
  - SSL
- **Best for**: Small production apps

### Standard Tier (S1)
- **Cost**: ~$70/month
- **Includes**:
  - Auto-scaling
  - Deployment slots
  - 50 GB storage
  - Daily backups
- **Best for**: Production with high traffic

### Premium Tier (P1V2)
- **Cost**: ~$85/month
- **Best for**: High performance needs

## Troubleshooting

### App not starting

```bash
# View logs
az webapp log tail \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME

# Check deployment logs
az webapp log deployment show \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME
```

### Compression not working

1. Check response headers:
```bash
curl -H "Accept-Encoding: gzip" -I https://your-app.azurewebsites.net
```

2. Should see:
```
Content-Encoding: gzip
Vary: Accept-Encoding
```

### GLB files not loading

1. Check MIME types in browser DevTools
2. Should be: `Content-Type: model/gltf-binary`
3. If wrong, check `web.config` or `server.js`

### Performance issues

```bash
# Scale up
az appservice plan update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_PLAN \
  --sku B2  # or S1, P1V2

# Enable CDN
# See "Enable Azure Front Door" section above
```

## Maintenance

### Update App

```bash
# ZIP deploy (easiest for updates)
zip -r kitto-app.zip . -x "node_modules/*" -x ".git/*"
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --src kitto-app.zip
```

### Backup

```bash
# Configure automatic backups (Standard tier+)
az webapp config backup update \
  --resource-group $RESOURCE_GROUP \
  --webapp-name $APP_NAME \
  --frequency 1d \
  --retain-one true \
  --retention 30 \
  --container-url "<storage-sas-url>"
```

### Monitor Costs

```bash
# View current month costs
az consumption usage list \
  --start-date $(date -v-30d +%Y-%m-%d) \
  --end-date $(date +%Y-%m-%d) \
  --query "[?contains(instanceName,'$APP_NAME')]"
```

## Security Best Practices

### Enable HTTPS Only

```bash
az webapp update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --https-only true
```

### Add Security Headers

Already included in `web.config`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

### Restrict Access (Optional)

```bash
# Whitelist specific IPs
az webapp config access-restriction add \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --rule-name "Allow-Office" \
  --action Allow \
  --ip-address 1.2.3.4/32 \
  --priority 100
```

## Summary

✅ **Quick Deploy**: Use ZIP deploy for fastest deployment
✅ **Production Ready**: `server.js` includes compression and caching
✅ **Cost Effective**: Start with F1 (free) or B1 ($13/month)
✅ **Scalable**: Easy to scale up when needed
✅ **Monitored**: Application Insights for performance tracking

**Your app is ready for Azure deployment!** 🚀

Next: Run `npm run prod` locally to test, then deploy with the commands above.
