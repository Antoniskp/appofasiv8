# VPS Deployment (Ubuntu/Debian)

## Important variables to change
-Database newsapp_user password

IN nano /var/www/appofasiv8/.env
CHANGE Database user and password
CHANGE NEXT_PUBLIC_API_URL=http://185.92.192.81

IN sudo nano /etc/nginx/sites-available/newsapp
CHANGE server_name your-domain.com YOUR_SERVER_IP;

## SSH Setup (Before Installation)

### Fix SSH Runtime Directory

The SSH daemon requires a runtime directory for proper operation. Create and configure it:

```bash
# Create SSH runtime directory
sudo mkdir -p /run/sshd

# Set proper permissions
sudo chmod 755 /run/sshd

# Create systemd tmpfiles configuration to persist across reboots
sudo tee /etc/tmpfiles.d/sshd.conf > /dev/null << 'EOF'
d /run/sshd 0755 root root -
EOF

# Apply the tmpfiles configuration
sudo systemd-tmpfiles --create

# Restart SSH service
sudo systemctl restart ssh
```

**Why this is needed:**
- `/run/sshd` is required by the SSH daemon for privilege separation
- The directory is typically on a tmpfs filesystem that gets cleared on reboot
- The tmpfiles.d configuration ensures it's recreated automatically on boot

### SSH Keepalive Configuration

Configure SSH keepalive settings to maintain stable connections:

```bash
# Append keepalive settings to SSH daemon configuration
sudo tee -a /etc/ssh/sshd_config > /dev/null << 'EOF'

# Keepalive settings
ClientAliveInterval 300
ClientAliveCountMax 5
TCPKeepAlive yes
EOF

# Restart SSH service to apply changes
sudo systemctl restart ssh
```

**What these settings do:**
- `ClientAliveInterval 300`: Server sends keepalive message every 300 seconds (5 minutes) to check if client is alive
- `ClientAliveCountMax 5`: Server disconnects after 5 unanswered keepalive messages (25 minutes total)
- `TCPKeepAlive yes`: Enables TCP-level keepalive probes at the operating system level to detect dead connections

---


1. **Install dependencies**
```bash
# Disable Virtuozzo/OpenVZ repo if present (avoids harmless Translation-en 404s)
grep -RIn "repo.virtuozzo.com/ctpreset" /etc/apt/sources.list /etc/apt/sources.list.d || true
sudo sh -c 'grep -RIl "repo.virtuozzo.com/ctpreset" /etc/apt/sources.list /etc/apt/sources.list.d | while read -r f; do mv "$f" "$f.disabled"; done' || true

# Update system
sudo apt update && sudo apt upgrade -y

# Install prerequisites for NodeSource setup (plus nano and git)
sudo apt install -y curl ca-certificates gnupg nano git

# Install Node.js 20 LTS via NodeSource (includes npm)
# Note: Next.js 16.x requires Node.js >=20.9.0
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

2. **Set up PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE newsapp;
CREATE USER newsapp_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE newsapp TO newsapp_user;
\q
```

3. **Clone and configure application**
```bash
cd /var/www
git clone https://github.com/Antoniskp/appofasiv8.git
cd appofasiv8

# Install all dependencies (including Next.js)
# Note: Even though 'next' is in dependencies (not devDependencies),
# you should install all packages to ensure proper binary linking
npm ci

cp .env.example .env
# Edit .env with production credentials
nano .env
```

4. **Build the frontend**
```bash
# Build the Next.js frontend for production
npm run frontend:build
```

5. **Start with PM2**

For a split frontend/backend deployment, you need to run both the Express backend and Next.js frontend as separate PM2 processes:

```bash
# Start the Express backend (API server) on port 3000
pm2 start src/index.js --name newsapp-backend

# Start the Next.js frontend on port 3001
pm2 start npm --name newsapp-frontend -- run frontend:start

# Save PM2 process list
pm2 save

# Enable PM2 to start on system boot
pm2 startup
```

**Important:** Both processes must be running for the application to work properly. The backend handles API requests at `/api/*`, while the frontend serves the Next.js application and its static assets at `/_next/*`.

6. **Set up nginx reverse proxy**

Install nginx and configure clean setup:

```bash
# Install nginx
sudo apt install -y nginx

# Remove default nginx site to avoid server_name conflicts
# This prevents warnings about conflicting server names for the same IP
sudo rm -f /etc/nginx/sites-enabled/default

# Create nginx configuration for the application
sudo nano /etc/nginx/sites-available/newsapp
```

Add configuration for split frontend/backend deployment. Replace `your-domain.com` with your actual domain and `YOUR_SERVER_IP` with your VPS IP address:

```nginx
server {
    listen 80;
    # Include both domain and IP to handle requests to either
    # Only ONE server block should claim the IP to avoid conflicts
    server_name your-domain.com YOUR_SERVER_IP;

    # Route API requests to Express backend on port 3000
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route Next.js static assets to frontend on port 3001
    # This includes JavaScript chunks, CSS, images, and other static files
    location /_next/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route all other requests (pages, etc.) to Next.js frontend on port 3001
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Why this routing is critical:**

This Nginx configuration is specifically designed for a **split frontend/backend deployment** where:
- The Express backend runs on `localhost:3000` and handles API routes
- The Next.js frontend runs on `localhost:3001` and serves the UI and static assets

**Common Issue: 404 Errors for `/_next/static` Chunks**

If Nginx routing is incorrect, you'll see 404 errors for Next.js static assets like:
- `/_next/static/chunks/*.js` - JavaScript bundles
- `/_next/static/css/*.css` - Stylesheets
- `/_next/static/media/*` - Images and fonts

These 404 errors will break the signup/sign-in pages and other client-side functionality because the browser cannot load the required JavaScript and CSS files.

**What happens with incorrect routing:**
- If all requests go to the backend (port 3000), the Express server won't know how to serve `/_next/*` paths
- Next.js static assets return 404 errors
- Client-side JavaScript fails to load
- Pages appear broken or don't function properly

**This configuration ensures:**
1. API calls (`/api/*`) are routed to the Express backend
2. Next.js static assets (`/_next/*`) are routed to the frontend server
3. All other paths (pages like `/`, `/login`, `/register`) are routed to Next.js for server-side rendering

Both the backend and frontend PM2 processes **must be running** for this routing to work correctly.

**Enable the site configuration:**

```bash
# Check if symlink already exists and remove it to avoid "File exists" error
if [ -L /etc/nginx/sites-enabled/newsapp ]; then
    sudo rm /etc/nginx/sites-enabled/newsapp
fi

# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/newsapp /etc/nginx/sites-enabled/

# Test nginx configuration for syntax errors
sudo nginx -t

# Restart nginx to apply changes
sudo systemctl restart nginx
```

**Note:** The symlink check ensures you can re-run these commands without encountering "File exists" errors when updating your configuration.

**Troubleshooting: Apache welcome page still showing**

If you see the Apache welcome page instead of your application, Apache may still be bound to port 80:

```bash
# Check what is listening on port 80
sudo ss -tulpn | grep :80

# Stop and disable Apache
sudo systemctl stop apache2
sudo systemctl disable apache2

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify port 80 is now owned by Nginx
sudo ss -tulpn | grep :80
```

You should see `nginx` in the output, not `apache2`.

7. **Set up SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Domain Configuration & HTTPS Setup

This section covers setting up a custom domain (e.g., `appofasi.gr`) with proper HTTPS configuration, including www-to-non-www redirects and SSL certificates for both domain variants.

### Prerequisites

Before starting, ensure you have:
- Domain DNS A records pointing to your VPS IP address
  - `appofasi.gr` → Your VPS IP
  - `www.appofasi.gr` → Your VPS IP
- Completed the basic nginx setup from step 6 above

### Step 1: Update Environment Variables

Update your `.env` file to use the production domain instead of localhost or IP addresses:

```bash
cd /var/www/appofasiv8
nano .env
```

Update the following variables:

```env
# Backend API URL for frontend
NEXT_PUBLIC_API_URL=https://appofasi.gr

# Frontend App URL (used for OAuth redirects)
NEXT_PUBLIC_APP_URL=https://appofasi.gr

# GitHub OAuth redirect URI (if using GitHub OAuth)
GITHUB_REDIRECT_URI=https://appofasi.gr/auth/github/callback
```

**Important:** After updating `.env`, rebuild the frontend and restart the services:

```bash
# Rebuild frontend with new environment variables
npm run frontend:build

# Restart both services
pm2 restart newsapp-backend newsapp-frontend
pm2 save
```

### Step 2: Configure Nginx for Domain and www Redirect

Update your nginx configuration to handle both domain variants and redirect www to non-www. This configuration also resolves the common "conflicting server_name" issue.

```bash
sudo nano /etc/nginx/sites-available/newsapp
```

Replace the existing configuration with the following. **Important:** Only ONE server block on port 80 should claim the server IP to avoid nginx conflicts.

```nginx
# HTTP: Redirect www to non-www
server {
    listen 80;
    server_name www.appofasi.gr;
    
    # Redirect all www traffic to non-www
    return 301 http://appofasi.gr$request_uri;
}

# HTTP: Main server block for non-www domain and IP
server {
    listen 80;
    # Include both the non-www domain and server IP
    # This is the ONLY port 80 block that should claim the IP
    server_name appofasi.gr YOUR_SERVER_IP;

    # Route API requests to Express backend on port 3000
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route Next.js static assets to frontend on port 3001
    location /_next/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route all other requests to Next.js frontend on port 3001
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Key Points:**
- **Two separate server blocks on port 80:** One for www redirect, one for the main domain + IP
- **Only the main (non-www) block includes the server IP** to avoid "conflicting server_name" warnings
- **www.appofasi.gr** has its own dedicated redirect block that sends all traffic to the non-www version
- Replace `YOUR_SERVER_IP` with your actual VPS IP address (e.g., `185.92.192.81`)

Test the nginx configuration:

```bash
# Test for syntax errors
sudo nginx -t

# Reload nginx if test passes
sudo systemctl reload nginx
```

### Step 3: Obtain SSL Certificates with Certbot

Run certbot to obtain SSL certificates for both the main domain and www subdomain. Certbot will automatically update the nginx configuration to add HTTPS server blocks.

```bash
# Install certbot if not already installed
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificates for both domains
sudo certbot --nginx -d appofasi.gr -d www.appofasi.gr
```

**During the certbot process:**
1. Provide your email address for renewal notifications
2. Agree to the terms of service
3. Choose whether to redirect HTTP to HTTPS (recommended: select "Yes" or option 2)

Certbot will:
- Obtain SSL certificates from Let's Encrypt
- Automatically update your nginx configuration
- Add HTTPS (port 443) server blocks
- Set up automatic HTTP-to-HTTPS redirects

### Step 4: Add HTTPS www-to-non-www Redirect

After certbot completes, you need to manually add a redirect for HTTPS www traffic. Edit the nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/newsapp
```

Certbot will have added HTTPS server blocks. Add a new HTTPS redirect block for www at the top of the file:

```nginx
# HTTPS: Redirect www to non-www
server {
    listen 443 ssl;
    server_name www.appofasi.gr;
    
    # SSL certificate paths (certbot manages these)
    ssl_certificate /etc/letsencrypt/live/appofasi.gr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/appofasi.gr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Redirect all www HTTPS traffic to non-www HTTPS
    return 301 https://appofasi.gr$request_uri;
}
```

**Important:** This HTTPS redirect block should be added **above** the main HTTPS server block that certbot created for `appofasi.gr`.

Test and reload nginx:

```bash
# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 5: Verify the Setup

Test that everything is working correctly:

```bash
# Test non-www HTTP (should redirect to HTTPS)
curl -I http://appofasi.gr

# Test www HTTP (should redirect to non-www HTTPS)
curl -I http://www.appofasi.gr

# Test www HTTPS (should redirect to non-www HTTPS)
curl -I https://www.appofasi.gr

# Test non-www HTTPS (should return 200 OK)
curl -I https://appofasi.gr
```

Expected results:
- `http://appofasi.gr` → redirects to `https://appofasi.gr`
- `http://www.appofasi.gr` → redirects to `https://appofasi.gr`
- `https://www.appofasi.gr` → redirects to `https://appofasi.gr`
- `https://appofasi.gr` → serves the application (200 OK)

**Note on IP Address Access:**
- HTTP access via IP (e.g., `http://185.92.192.81`) will work normally and serve the application
- HTTPS access via IP (e.g., `https://185.92.192.81`) will show a certificate warning because SSL certificates are issued for domain names, not IP addresses
- Users should access the site via `https://appofasi.gr` for secure, warning-free access

### Complete nginx Configuration Example

After completing all steps, your final nginx configuration should look similar to this:

```nginx
# HTTPS: Redirect www to non-www
server {
    listen 443 ssl;
    server_name www.appofasi.gr;
    
    ssl_certificate /etc/letsencrypt/live/appofasi.gr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/appofasi.gr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    return 301 https://appofasi.gr$request_uri;
}

# HTTP: Redirect www to non-www
server {
    listen 80;
    server_name www.appofasi.gr;
    return 301 http://appofasi.gr$request_uri;
}

# HTTP: Main server (certbot will add redirect to HTTPS here)
server {
    listen 80;
    server_name appofasi.gr YOUR_SERVER_IP;
    
    # Certbot will add: return 301 https://$host$request_uri;
    
    # ... rest of HTTP config (may be replaced by redirect)
}

# HTTPS: Main application server
server {
    listen 443 ssl;
    server_name appofasi.gr YOUR_SERVER_IP;
    
    ssl_certificate /etc/letsencrypt/live/appofasi.gr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/appofasi.gr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Note: Including YOUR_SERVER_IP in server_name allows direct IP access,
    # but will show a certificate warning since the SSL cert is only for appofasi.gr
    # Users should access the site via https://appofasi.gr for proper HTTPS

    # Route API requests to Express backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route Next.js static assets
    location /_next/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route all other requests to Next.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Troubleshooting: Conflicting server_name

**Issue:** Nginx reports `conflicting server name "YOUR_SERVER_IP" on 0.0.0.0:80`

**Cause:** Multiple server blocks on the same port (80 or 443) are claiming the same server IP address.

**Solution:**
1. Ensure only ONE port 80 server block includes `YOUR_SERVER_IP` in its `server_name` directive
2. The www redirect block should ONLY include `www.appofasi.gr`, not the IP
3. The main server block should include both `appofasi.gr` and `YOUR_SERVER_IP`

**Correct pattern:**
```nginx
# ✓ www block - no IP address
server {
    listen 80;
    server_name www.appofasi.gr;  # Only www, no IP
    return 301 http://appofasi.gr$request_uri;
}

# ✓ Main block - includes IP address
server {
    listen 80;
    server_name appofasi.gr YOUR_SERVER_IP;  # Non-www + IP
    # ... application routes
}
```

**Incorrect pattern:**
```nginx
# ✗ Both blocks claim the IP - causes conflict
server {
    listen 80;
    server_name www.appofasi.gr YOUR_SERVER_IP;  # Wrong: IP here
    return 301 http://appofasi.gr$request_uri;
}

server {
    listen 80;
    server_name appofasi.gr YOUR_SERVER_IP;  # Conflict: IP here too
    # ... application routes
}
```

### Certificate Renewal

Let's Encrypt certificates are valid for 90 days. Certbot automatically sets up a renewal cron job or systemd timer.

Verify auto-renewal is configured:

```bash
# Test renewal process (dry run)
sudo certbot renew --dry-run

# Check renewal timer status
sudo systemctl status certbot.timer
```

Certificates will automatically renew when they have 30 days or less remaining.

---

## Update After Merge (Server)

Use these commands on the VPS after pulling the latest changes from `main`.

### Update the repo from GitHub

```bash
cd /var/www/appofasiv8

git fetch --all
git checkout main
git pull origin main
```

### Install/update dependencies

After pulling changes, always reinstall dependencies:

```bash
# Clean install to ensure all dependencies are properly linked
npm ci
```

**Important:** Do not use `npm install --omit=dev` as it may skip dependency linking steps required for proper binary installation, even for packages in the main dependencies section.

### Update environment variables

`.env.example` should include:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Package scripts

```bash
npm run frontend         # dev server (port 3001)
npm run frontend:build   # production build
npm run frontend:start   # production server
```

### Clean Update Workflow

For a complete rebuild that ensures all changes are properly applied and old build artifacts are cleared, follow this comprehensive update workflow:

#### Step 1: Stop running services

Stop both PM2 processes to prevent conflicts during the update:

```bash
cd /var/www/appofasiv8

# Stop both backend and frontend
pm2 stop newsapp-backend newsapp-frontend
```

#### Step 2: Fetch and pull latest changes

Update the repository from GitHub:

```bash
# Fetch all changes from remote
git fetch --all

# Ensure you're on the main branch
git checkout main

# Pull the latest changes
git pull origin main
```

#### Step 3: Remove build artifacts

Clean the Next.js build directory to ensure a fresh build:

```bash
# Remove Next.js build output
rm -rf .next
```

This ensures that:
- Old cached build files are removed
- Any stale static assets are cleared
- The next build will be completely fresh

#### Step 4: Clean dependency reinstallation

Always use `npm ci` for a clean dependency installation:

```bash
# Clean install all dependencies
npm ci
```

**Important:** Do not use `npm install --omit=dev` as it may skip dependency linking steps required for proper binary installation, even for packages in the main dependencies section (like `next`). The `npm ci` command installs exactly what's in `package-lock.json` and ensures all binaries are properly linked.

#### Step 5: Build the frontend

Run the production build for the Next.js frontend:

```bash
# Build the frontend for production
npm run frontend:build
```

This creates optimized production assets in the `.next` directory.

#### Step 6: Restart services

Restart both PM2 processes to run the updated application:

```bash
# Restart both backend and frontend
pm2 restart newsapp-backend newsapp-frontend

# Save PM2 configuration
pm2 save
```

**Note:** If you're upgrading from a single-process deployment (old configuration), you'll need to delete the old process and start both new ones:

```bash
# Delete old single process
pm2 delete newsapp

# Start both new processes
pm2 start src/index.js --name newsapp-backend
pm2 start npm --name newsapp-frontend -- run frontend:start

# Save PM2 configuration
pm2 save
```

#### Step 7: Reload nginx (if configuration changed)

If nginx configuration was updated, reload it:

```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx if config is valid
sudo systemctl reload nginx
```

**Note:** If no nginx configuration changes were made, this step can be skipped.

#### Complete Clean Update Script

Here's the complete sequence for copy-paste convenience:

```bash
# Navigate to application directory
cd /var/www/appofasiv8

# Stop running services
pm2 stop newsapp-backend newsapp-frontend

# Fetch and pull latest changes
git fetch --all
git checkout main
git pull origin main

# Remove build artifacts
rm -rf .next

# Clean install dependencies
npm ci

# Build frontend
npm run frontend:build

# Restart services
pm2 restart newsapp-backend newsapp-frontend
pm2 save

# Reload nginx (only if config changed)
# sudo nginx -t && sudo systemctl reload nginx
```

Problemsolving

```bash

# Fix the Duplicate PM2 Frontend Process
# Stop all running 'newsapp-frontend' processes
pm2 stop newsapp-frontend

# Delete all 'newsapp-frontend' processes
pm2 delete newsapp-frontend

# Restart the frontend with a clean configuration
pm2 start npm --name newsapp-frontend -- run frontend:start

pm2 status
# Test Nginx configuration syntax
sudo nginx -t

# If no errors, reload Nginx
sudo systemctl reload nginx

# Clean Stale PM2 State (if Issues Persist)
pm2 unstartup
pm2 kill
pm2 startup
pm2 save
```

**For upgrading from old single-process deployment:**

```bash
# Navigate to application directory
cd /var/www/appofasiv8

# Stop and delete old single process
pm2 stop newsapp
pm2 delete newsapp

# Fetch and pull latest changes
git fetch --all
git checkout main
git pull origin main

# Remove build artifacts
rm -rf .next

# Clean install dependencies
npm ci

# Build frontend
npm run frontend:build

# Start both new processes
pm2 start src/index.js --name newsapp-backend
pm2 start npm --name newsapp-frontend -- run frontend:start
pm2 save

# Update nginx configuration with split routing (see section 6 above)
# sudo nano /etc/nginx/sites-available/newsapp
# sudo nginx -t && sudo systemctl reload nginx
```

#### When to use this workflow

Use this clean update workflow when:
- Major version updates have been made
- Dependencies have been added, removed, or updated
- You're experiencing issues with stale build artifacts
- You want to ensure a completely fresh deployment
- Troubleshooting deployment issues

For simple code changes without dependency or configuration updates, the basic update workflow (git pull + npm ci + pm2 restart) may be sufficient.

---

## Troubleshooting

### Error: `sh: 1: next: not found`

If you encounter the error `sh: 1: next: not found` when running `npm run frontend`, `npm run frontend:build`, or `npm run frontend:start`, this means the Next.js binary is not available in your `node_modules/.bin` directory.

#### Root Causes

1. **Incomplete dependency installation** - Dependencies were not fully installed
2. **Using `--omit=dev` flag** - This flag can affect the dependency resolution and binary linking process, preventing the `next` binary from being properly installed in `node_modules/.bin`
3. **Corrupted `node_modules`** - The `node_modules` directory or package lock may be corrupted

#### Solution Steps

**Step 1: Clean and reinstall dependencies**

```bash
cd /var/www/appofasiv8

# Remove existing node_modules and lock file
rm -rf node_modules package-lock.json

# Clean npm cache (optional but recommended)
npm cache clean --force

# Fresh install with locked dependencies
npm ci
```

**Step 2: Verify Next.js installation**

```bash
# Check if next binary exists
ls -la node_modules/.bin/next

# Test next command directly
./node_modules/.bin/next --version
```

**Step 3: Run frontend scripts**

```bash
# For development
npm run frontend

# For production build
npm run frontend:build

# For production server
npm run frontend:start
```

#### Production Deployment Notes

For production deployments on a VPS:

- **Always use `npm ci`** instead of `npm install` for reproducible builds
- **Do NOT use `--omit=dev`** for this project - all frontend dependencies are in the main `dependencies` section
- The `next` package is required at runtime for both building and serving the frontend
- Ensure sufficient disk space and memory during installation

#### Verification Checklist

After installation, verify:

- [ ] `node_modules/.bin/next` exists and is executable
- [ ] `./node_modules/.bin/next --version` shows the installed Next.js version
- [ ] `npm run frontend` starts the development server on port 3001
- [ ] `npm run frontend:build` completes successfully
- [ ] `npm run frontend:start` runs the production server on port 3001

---

### Error: Node.js version requirement

If you encounter errors like `You are using Node.js 18.x.x. For Next.js, Node.js version ">=20.9.0" is required`, you need to upgrade Node.js.

#### Symptoms

When running `npm run frontend`, `npm run frontend:build`, or `npm run frontend:start`, you see:

```
You are using Node.js 18.20.8. For Next.js, Node.js version ">=20.9.0" is required.
```

#### Solution: Upgrade to Node.js 20 LTS

**Step 1: Remove old Node.js version**

```bash
# Remove existing Node.js installation
sudo apt remove -y nodejs
sudo apt autoremove -y
```

**Step 2: Install Node.js 20 LTS**

```bash
# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Step 3: Verify Node.js version**

```bash
# Check Node.js version (should be 20.x or higher)
node --version

# Check npm version
npm --version
```

**Step 4: Reinstall dependencies**

```bash
cd /var/www/appofasiv8

# Remove existing node_modules to avoid compatibility issues
rm -rf node_modules package-lock.json

# Fresh install with new Node.js version
npm ci
```

**Step 5: Test frontend scripts**

```bash
# Should now run without version errors
npm run frontend:build
npm run frontend:start
```

#### Why Node.js 20 is required

- Next.js 16.x requires Node.js >=20.9.0 for compatibility
- The initial deployment guide has been updated to install Node.js 20 LTS
- Older deployments using Node.js 18 must upgrade to support Next.js 16
