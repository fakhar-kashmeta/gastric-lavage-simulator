# Kashmeta Gastric Lavage Simulator - Complete Deployment Package

## 📦 What You're Getting

This package contains everything you need to deploy your medical training game to Google Cloud.

---

## 📄 FILES IN THIS PACKAGE

### **1. DEPLOYMENT_GUIDE.md** (Main Guide)
Complete step-by-step deployment guide with:
- Code structure analysis
- Security checks
- Deployment options comparison
- Detailed Cloud Run setup
- Troubleshooting guide
- Cost estimation
- Monitoring setup

**👉 Start here for full details**

---

### **2. QUICK_START.md** (Fast Track)
Quick 5-minute deployment guide in Urdu/Hindi:
- Quick setup steps
- Troubleshooting common issues
- FAQ
- Important values explained
- Cost calculation
- Commands reference

**👉 Use this for quick deployment**

---

### **3. deploy.sh** (Automated Script)
One-command deployment script that:
- ✅ Checks gcloud CLI
- ✅ Enables Google Cloud APIs
- ✅ Builds Docker image
- ✅ Deploys to Cloud Run
- ✅ Provides service URL

**How to use:**
```bash
chmod +x deploy.sh  # Make executable
bash deploy.sh      # Run the script
```

---

### **4. Dockerfile**
Production Docker image with:
- Multi-stage build (optimized)
- Frontend build included
- Backend ready to run
- Health checks enabled

**Auto-used by:** deploy.sh

---

### **5. .dockerignore**
Optimizes Docker build by excluding:
- Unnecessary files
- Cache directories
- Environment configs
- Development tools

**Auto-used by:** Docker build process

---

### **6. .env.local.production**
Environment variables template with:
- All required configuration
- Detailed comments
- Security notes
- Production values

**👉 Copy this to backend/.env.local before deployment**

---

### **7. server.js.updated**
Updated backend server with:
- ✅ Frontend static file serving
- ✅ React Router SPA support
- ✅ Better logging
- ✅ Comments and documentation

**👉 Replace your backend/server.js with this version**

---

## 🚀 QUICK START (3 STEPS)

### **Step 1: Prepare**
```bash
# Copy environment file
cp .env.local.production backend/.env.local

# Edit it with your Google Cloud Project ID
# GOOGLE_CLOUD_PROJECT = "YOUR_PROJECT_ID"

# Update backend server (optional but recommended)
cp server.js.updated backend/server.js
```

### **Step 2: Deploy**
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
bash deploy.sh

# Follow the prompts:
# - Confirm project
# - Set service name (default: kashmeta-simulator)
# - Set region (default: us-central1)
# - Wait for deployment (5-10 minutes)
```

### **Step 3: Access**
```
Script will give you URL like:
https://kashmeta-simulator-xxxxx.run.app

Open in browser and play! 🎮
```

---

## 📋 WHAT'S BEING DEPLOYED

```
Your Game:
├── Frontend (React + TypeScript)
│   ├── Game UI
│   ├── Patient illustration
│   ├── Step-by-step interface
│   └── Scoring system
│
└── Backend (Node.js + Express)
    ├── API proxy for Vertex AI
    ├── Authentication handler
    ├── Rate limiting (security)
    ├── WebSocket streaming
    └── Static file server
```

---

## 🏗️ DEPLOYMENT ARCHITECTURE

```
Internet
   │
   └─→ Google Cloud Run (Backend + Frontend)
       │
       ├─→ Node.js Express Server
       │   ├─→ API Proxy
       │   └─→ Static Files (React Build)
       │
       └─→ Google Vertex AI (AI Engine)
           └─→ Medical models
```

---

## 🔧 REQUIREMENTS

### **Before You Start:**
- [ ] Google Cloud Account (create at cloud.google.com)
- [ ] Billing enabled on project
- [ ] gcloud CLI installed
- [ ] Node.js v20+ installed (for local development)
- [ ] Docker (optional - Cloud Run can use Buildpacks)

### **Installation (One-time):**

**macOS:**
```bash
# Install gcloud
brew install --cask google-cloud-sdk

# Install Node.js
brew install node

# Verify installation
gcloud --version
node --version
```

**Windows:**
```
Download:
- gcloud SDK: https://cloud.google.com/sdk/docs/install
- Node.js: https://nodejs.org/

Run installers and follow prompts
```

**Linux (Ubuntu/Debian):**
```bash
# Install gcloud
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Install Node.js
sudo apt-get install nodejs npm

# Verify
gcloud --version
node --version
```

---

## 💰 COSTS

### **Free Tier (Perfect for Testing):**
- Cloud Run: 2,000,000 requests/month free
- Vertex AI: Some models free
- **Cost: $0**

### **Small Scale (100-1000 users/day):**
- Cloud Run requests: ~$1-3/month
- Vertex AI calls: ~$2-5/month
- Storage: ~$0.50/month
- **Total: ~$5-10/month**

### **Medium Scale (1000-10k users/day):**
- **Total: ~$50-200/month** (depending on traffic)

---

## 🔒 SECURITY FEATURES

✅ **Built-in:**
- Rate limiting (100 requests/15 minutes)
- SSRF protection (whitelist only)
- Request validation
- Environment variable secrets
- Authentication via Google Cloud

⚠️ **You should do:**
1. Change `PROXY_HEADER` (random secret)
2. Verify `GOOGLE_CLOUD_PROJECT`
3. Enable monitoring
4. Setup alerts
5. Regular security audits

---

## 📊 MONITORING

After deployment, monitor:

```bash
# View logs in real-time
gcloud run services logs read kashmeta-simulator --follow

# View service metrics
gcloud run services describe kashmeta-simulator --region us-central1

# View all deployments
gcloud run services list
```

---

## 🐛 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| gcloud not found | Install Google Cloud SDK |
| Project not found | Set: `gcloud config set project YOUR_PROJECT_ID` |
| Build fails | Check disk space, retry deployment |
| Service not responding | Check logs: `gcloud run services logs read kashmeta-simulator` |
| CORS errors | Update backend server with server.js.updated |
| High costs | Check logs, reduce rate limit, setup alerts |

---

## 📚 NEXT STEPS

### **After Successful Deployment:**

1. **Setup Custom Domain** (optional)
   ```bash
   gcloud run domain-mappings create \
     --service kashmeta-simulator \
     --domain yourgame.com
   ```

2. **Setup Monitoring**
   ```bash
   gcloud monitoring dashboards create --config-from-file=dashboard.yaml
   ```

3. **Enable Auto-scaling**
   ```bash
   gcloud run services update kashmeta-simulator \
     --max-instances 100 \
     --region us-central1
   ```

4. **Setup CI/CD** (optional)
   - Integrate with GitHub Actions
   - Auto-deploy on code push
   - Automated testing

---

## 📞 SUPPORT & DOCUMENTATION

### **Official Resources:**
- [Google Cloud Run Docs](https://cloud.google.com/run/docs)
- [Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
- [gcloud CLI Docs](https://cloud.google.com/sdk/gcloud/reference)
- [Node.js on Cloud Run](https://cloud.google.com/nodejs/docs/deployment/run)

### **Common Commands:**

```bash
# View all services
gcloud run services list

# View specific service
gcloud run services describe kashmeta-simulator --region us-central1

# View logs
gcloud run services logs read kashmeta-simulator --limit 100

# Stream logs
gcloud run services logs read kashmeta-simulator --follow

# Update service
gcloud run deploy kashmeta-simulator --source .

# Delete service
gcloud run services delete kashmeta-simulator
```

---

## 🎮 GAME FEATURES

Your Kashmeta Gastric Lavage Simulator includes:

- **Interactive Training**: Step-by-step medical procedure
- **Scoring System**: Points for correct actions
- **Mistake Tracking**: Learn from errors
- **Timer**: Track procedure duration
- **Patient Illustration**: Visual feedback
- **Drag & Drop**: Intuitive interface
- **Responsive Design**: Works on all devices
- **AI Integration**: Uses Google Vertex AI

---

## 📝 DEPLOYMENT CHECKLIST

Before going live:
- [ ] Google Cloud Account created
- [ ] Billing enabled
- [ ] gcloud CLI installed
- [ ] .env.local configured
- [ ] deploy.sh executable
- [ ] Read DEPLOYMENT_GUIDE.md
- [ ] Run deploy.sh
- [ ] Test the game
- [ ] Setup monitoring
- [ ] Configure alerts

---

## ❓ FAQ

**Q: How long does deployment take?**
A: Usually 5-10 minutes total.

**Q: Is it free?**
A: Cloud Run offers 2M free requests/month. Beyond that, ~$0.40 per 1M requests.

**Q: Can I use my own domain?**
A: Yes! Use `gcloud run domain-mappings create` command.

**Q: How many users can it handle?**
A: Cloud Run auto-scales. Default max is 100 instances (adjust with --max-instances).

**Q: Can I deploy locally?**
A: Yes, use: `npm install && npm run dev`

**Q: How do I update the game?**
A: Re-run `bash deploy.sh` or use gcloud deploy commands.

---

## 🎯 FINAL NOTES

1. **Keep .env.local secrets safe** - Never commit to git
2. **Monitor costs monthly** - Check Google Cloud billing
3. **Update regularly** - Security patches important
4. **Backup your code** - Use version control (GitHub)
5. **Test thoroughly** - Try all game features before launch

---

## 📞 QUICK HELP

Got stuck? Check:
1. [QUICK_START.md](QUICK_START.md) - Fast answers
2. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed help
3. Logs: `gcloud run services logs read kashmeta-simulator --follow`
4. [Google Cloud Docs](https://cloud.google.com)

---

## 🎉 READY TO DEPLOY?

```bash
# 1. Make script executable
chmod +x deploy.sh

# 2. Run the script
bash deploy.sh

# 3. Follow prompts
# 4. Game live in 5-10 minutes!

# 5. View logs if needed
gcloud run services logs read kashmeta-simulator --follow
```

---

**Happy deploying! 🚀**

For questions or issues, refer to DEPLOYMENT_GUIDE.md or Google Cloud documentation.

---

**Package Contents Summary:**
- ✅ DEPLOYMENT_GUIDE.md (Complete guide)
- ✅ QUICK_START.md (Fast deployment)
- ✅ deploy.sh (Automated script)
- ✅ Dockerfile (Container config)
- ✅ .dockerignore (Optimization)
- ✅ .env.local.production (Environment template)
- ✅ server.js.updated (Backend with static serving)
- ✅ README.md (This file)

**Status: Ready to Deploy ✅**
