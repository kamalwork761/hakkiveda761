# Hostinger Linux VPS Deployment Guide

This application is production-ready for deployment on a **Hostinger Ubuntu Linux VPS** (or any cloud VPS like DigitalOcean, AWS, Linode).

---

## Prerequisites

1. **Hostinger VPS** running **Ubuntu 22.04 LTS** or **Ubuntu 24.04 LTS**.
2. Registered **Domain Name** pointed to your Hostinger VPS IP address (A Record).
3. **SSH Access** to your VPS (`ssh root@YOUR_VPS_IP`).

---

## Deployment Option A: Docker & Docker Compose (Recommended)

### Step 1: Install Docker & Docker Compose on Ubuntu VPS

```bash
# Update Ubuntu package index
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify Docker installation
docker --version
docker compose version
```

### Step 2: Clone Repository & Setup Environment Variables

```bash
# Clone your repository from GitHub
git clone https://github.com/your-username/your-repo.git /var/www/hakkiveda
cd /var/www/hakkiveda

# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

Set your values in `.env`:
```env
PORT=3000
NODE_ENV=production
APP_URL=https://yourdomain.com
GEMINI_API_KEY=your_actual_gemini_api_key
UPLOAD_DIR=/app/uploads
```

### Step 3: Launch with Docker Compose

```bash
# Build and start the container in background
docker compose up -d --build

# Check running status & logs
docker compose ps
docker compose logs -f
```

---

## Deployment Option B: Node.js + PM2 (Without Docker)

### Step 1: Install Node.js 20 & PM2

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

### Step 2: Build App & Start with PM2

```bash
cd /var/www/hakkiveda
npm ci
npm run build

# Start app with PM2
pm2 start dist/server.cjs --name "hakkiveda-app"

# Save PM2 process list to restart automatically on server reboot
pm2 save
pm2 startup
```

---

## Step 4: Configure Nginx & Let's Encrypt SSL (HTTPS)

### Step 1: Install Nginx & Certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Step 2: Configure Nginx Site Block

```bash
# Copy Nginx config to site-available
sudo cp /var/www/hakkiveda/nginx.conf /etc/nginx/sites-available/hakkiveda.conf

# Replace 'yourdomain.com' with your actual domain
sudo sed -i 's/yourdomain.com/your-actual-domain.com/g' /etc/nginx/sites-available/hakkiveda.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/hakkiveda.conf /etc/nginx/sites-enabled/

# Test Nginx syntax & reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Obtain Free Let's Encrypt SSL Certificate

```bash
sudo certbot --nginx -d your-actual-domain.com -d www.your-actual-domain.com
```

Certbot will automatically verify your domain and update Nginx to handle HTTPS securely with automatic 90-day renewal!

---

## Verification & Health Check

You can test your deployment at any time by accessing:
- **Website**: `https://your-actual-domain.com`
- **API Health Check**: `https://your-actual-domain.com/api/health`

---

## Persistent Media Storage Note

Uploaded product media, banner images, and customer PDFs are stored safely in `/var/www/hakkiveda/uploads` (or Docker volume `uploads_data`).
If you ever want to migrate from local disk to **AWS S3 / MinIO**, simply configure the `STORAGE_PROVIDER=s3` and S3 credentials in `.env` without changing frontend component code!
