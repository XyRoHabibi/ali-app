#!/bin/bash
# ============================================
# Ali App - VPS Deployment Script
# Ubuntu 24.04 | Docker + Nginx
# ============================================
set -e

# Warna terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_step() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✅ STEP $1: $2${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_info() {
    echo -e "${YELLOW}  ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}  ❌ $1${NC}"
}

# =============================================
# VARIABEL - Sesuaikan jika perlu
# =============================================
APP_DIR="/opt/ali-app"
REPO_URL="https://github.com/XyRoHabibi/ali-app.git"
VPS_IP="72.60.76.175"

echo -e "${GREEN}"
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║       🚀 Ali App - VPS Deployment         ║"
echo "  ║       Ubuntu 24.04 + Docker + Nginx        ║"
echo "  ╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# =============================================
# STEP 1: Update System
# =============================================
print_step "1/7" "Updating System"
apt update && apt upgrade -y
apt install -y curl git ufw htop nano

# =============================================
# STEP 2: Setup Firewall
# =============================================
print_step "2/7" "Configuring Firewall (UFW)"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable
ufw status
print_info "Firewall configured: SSH(22) + HTTP(80) + HTTPS(443)"

# =============================================
# STEP 3: Install Docker
# =============================================
print_step "3/7" "Installing Docker & Docker Compose"

if command -v docker &> /dev/null; then
    print_info "Docker already installed, skipping..."
else
    # Remove old versions
    apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

    # Install prerequisites
    apt install -y ca-certificates curl gnupg lsb-release

    # Add Docker GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    # Add Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Start & enable Docker
    systemctl start docker
    systemctl enable docker

    print_info "Docker installed successfully!"
fi

docker --version
docker compose version

# =============================================
# STEP 4: Clone Project
# =============================================
print_step "4/7" "Cloning Project from GitHub"

if [ -d "$APP_DIR/.git" ]; then
    print_info "Project already exists, pulling latest..."
    cd "$APP_DIR"
    git pull origin main
else
    print_info "Cloning repository..."
    mkdir -p "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# =============================================
# STEP 5: Configure Environment
# =============================================
print_step "5/7" "Configuring Environment Variables"

# Generate secure values
NEW_POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
NEW_NEXTAUTH_SECRET=$(openssl rand -base64 32)

if [ ! -f "$APP_DIR/.env" ]; then
    cat > "$APP_DIR/.env" << ENVEOF
# ============================================
# Ali App - Production Environment Variables
# Generated on: $(date)
# ============================================

# --- PostgreSQL ---
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${NEW_POSTGRES_PASSWORD}
POSTGRES_DB=ali_app_db

# --- Prisma Database URLs ---
DATABASE_URL=postgresql://postgres:${NEW_POSTGRES_PASSWORD}@postgres:5432/ali_app_db?schema=public
DIRECT_URL=postgresql://postgres:${NEW_POSTGRES_PASSWORD}@postgres:5432/ali_app_db?schema=public

# --- NextAuth ---
NEXTAUTH_SECRET=${NEW_NEXTAUTH_SECRET}
NEXTAUTH_URL=http://${VPS_IP}

# --- Email (Nodemailer) ---
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=kariralispase@gmail.com
EMAIL_PASS=hejgrpxcszxftoaf
EMAIL_FROM=info@akseslegal.id

# --- Google OAuth (Opsional) ---
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# --- Google reCAPTCHA ---
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdSEHgsAAAAAHJywdBdzn2pP8Ic9ign7B3l0S_4
RECAPTCHA_SECRET_KEY=6LdSEHgsAAAAAIUJmQf7lU4kLz1MTeK1q1TrSZvB
ENVEOF
    print_info ".env file created with secure passwords"
    print_info "PostgreSQL Password: ${NEW_POSTGRES_PASSWORD}"
    print_info "Please save this password somewhere safe!"
else
    print_info ".env file already exists, skipping..."
fi

# =============================================
# STEP 6: Build & Run Docker Containers
# =============================================
print_step "6/7" "Building & Starting Docker Containers"
cd "$APP_DIR"

print_info "Building containers (this may take 5-10 minutes)..."
docker compose up -d --build

print_info "Waiting for containers to be ready..."
sleep 15

# Check container status
docker compose ps

# =============================================
# STEP 7: Setup Nginx Reverse Proxy
# =============================================
print_step "7/7" "Setting up Nginx Reverse Proxy"

apt install -y nginx

# Create Nginx config
cat > /etc/nginx/sites-available/ali-app << NGINXEOF
server {
    listen 80;
    server_name ${VPS_IP};

    # Upload size limit
    client_max_body_size 50M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
NGINXEOF

# Enable site
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/ali-app /etc/nginx/sites-enabled/

# Test & restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# =============================================
# DONE!
# =============================================
echo ""
echo -e "${GREEN}"
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║                                                           ║"
echo "  ║   🎉 DEPLOYMENT COMPLETE!                                ║"
echo "  ║                                                           ║"
echo "  ║   Website: http://${VPS_IP}                       ║"
echo "  ║                                                           ║"
echo "  ║   Useful commands:                                        ║"
echo "  ║   • docker compose ps          - Check status             ║"
echo "  ║   • docker compose logs -f     - View logs                ║"
echo "  ║   • docker compose restart app - Restart app              ║"
echo "  ║                                                           ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
