# VPS Deployment (Ubuntu/Debian)

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

4. **Start with PM2**
```bash
pm2 start src/index.js --name newsapp
pm2 save
pm2 startup
```

5. **Set up nginx reverse proxy**
```bash
sudo apt install -y nginx

# Create nginx configuration
sudo nano /etc/nginx/sites-available/newsapp
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
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
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/newsapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

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

6. **Set up SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

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

Stop PM2 processes to prevent conflicts during the update:

```bash
cd /var/www/appofasiv8

# Stop the application
pm2 stop newsapp
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

Restart PM2 to run the updated application:

```bash
# Start the application
pm2 start newsapp

# Or restart if prefer
pm2 restart newsapp

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
pm2 stop newsapp

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
pm2 restart newsapp
pm2 save

# Reload nginx (only if config changed)
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
