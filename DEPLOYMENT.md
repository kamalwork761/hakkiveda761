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

---

## Android App & Google Play Store Release Guide

The repository includes a complete **Capacitor native Android project** (`/android`) configured specifically for HAKKIVEDA with:
- **Package ID**: `com.hakkiveda.app`
- **Branded App Icons**: Royal gold "HV" crest on forest green across all densities (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`, adaptive + round).
- **Splash Screen**: Branded forest green launch screen with gold typography and auto-dismissal.
- **Native Android Hardware Back Button**: Closes modals, sheets, and drawers sequentially before exiting.
- **External Intent Interception**: WhatsApp, Phone (`tel:`), Email (`mailto:`), and Razorpay checkout handled natively.
- **Hair Root Analysis**: Camera and gallery upload with zero permission friction.

### 1. Build and Sync Web Assets
```bash
# Build the production React web bundle
npm run build

# Sync the assets and plugins into the Android native project
npx cap sync android
```

### 2. Generate Release APK or Android App Bundle (AAB)
To generate an **Android App Bundle (.aab)** for Google Play Console submission:

```bash
cd android

# Generate release bundle using Gradle
./gradlew bundleRelease

# Or generate a standalone signed/unsigned APK for testing on physical devices:
./gradlew assembleRelease
```
The output `.aab` file will be generated at:
`android/app/build/outputs/bundle/release/app-release.aab`

The output `.apk` file will be generated at:
`android/app/build/outputs/apk/release/app-release-unsigned.apk`

### 3. Signing the Release AAB / APK for Google Play Store
Create or use your production upload keystore:
```bash
keytool -genkey -v -keystore hakkiveda-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias hakkiveda
```

You can pass signing credentials via environment variables during CI/CD or local build:
```bash
export KEYSTORE_PATH="/path/to/hakkiveda-release-key.jks"
export KEYSTORE_PASSWORD="your-keystore-password"
export KEY_ALIAS="hakkiveda"
export KEY_PASSWORD="your-key-password"

./gradlew bundleRelease
```

### 4. Upload to Google Play Console
1. Log in to [Google Play Console](https://play.google.com/console).
2. Create app -> **HAKKIVEDA** (Default language: English (India), App, Free).
3. Under **Production** -> **Create new release**, upload `app-release.aab`.
4. Fill in Store Presence, Privacy Policy (`https://hakkiveda.com/legal/privacy-policy`), Data Safety (Camera used for Hair Root Analysis photo upload), and submit for review.
