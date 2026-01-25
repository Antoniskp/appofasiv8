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

## DNS Resolution Troubleshooting (OpenVZ/venet VPSes)

### Understanding the Issue

On OpenVZ VPSes using venet network interfaces, the systemd-resolved stub listener (127.0.0.53) may fail to bind properly to venet0. This can cause DNS resolution failures even when network connectivity is working, preventing package installation and updates.

### Diagnosing DNS Issues

First, verify that network connectivity is working but DNS resolution is failing:

```bash
# Test basic network connectivity (should succeed)
ping -c 3 1.1.1.1

# Test DNS resolution (may fail)
ping -c 3 archive.ubuntu.com

# Check current DNS configuration
resolvectl status
```

**Signs of the problem:**
- `ping 1.1.1.1` succeeds (network works)
- `ping archive.ubuntu.com` fails with "Temporary failure in name resolution"
- `resolvectl status` shows DNS server as 127.0.0.53 but queries fail

### Solution 1: Static /etc/resolv.conf (Recommended)

This is the most reliable solution for OpenVZ/venet environments:

```bash
# Stop and disable systemd-resolved
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved

# Remove the symlink and create a static resolv.conf
sudo rm /etc/resolv.conf
sudo tee /etc/resolv.conf > /dev/null << 'EOF'
nameserver 1.1.1.1
nameserver 8.8.8.8
EOF

# Prevent the file from being overwritten
sudo chattr +i /etc/resolv.conf

# Test DNS resolution (should now work)
ping -c 3 archive.ubuntu.com

# Update package lists (should now succeed)
sudo apt update
```

**Why this works:**
- Bypasses systemd-resolved entirely
- Uses reliable public DNS servers (Cloudflare 1.1.1.1 and Google 8.8.8.8)
- The `chattr +i` flag prevents the file from being modified by other processes

### Solution 2: Configure systemd-resolved for venet0 (Alternative)

If you prefer to keep systemd-resolved running, bind DNS resolution to the venet0 interface:

```bash
# Configure DNS servers for venet0 interface
sudo resolvectl dns venet0 1.1.1.1 8.8.8.8

# Set DNS search domain for venet0
sudo resolvectl domain venet0 '~.'

# Verify the configuration
resolvectl status venet0

# Test DNS resolution
resolvectl query archive.ubuntu.com

# Test with ping
ping -c 3 archive.ubuntu.com

# Update package lists
sudo apt update
```

**Note:** This configuration may not persist across reboots. For a permanent solution, add the following to `/etc/systemd/network/venet0.network`:

```bash
sudo tee /etc/systemd/network/venet0.network > /dev/null << 'EOF'
[Match]
Name=venet0

[Network]
DNS=1.1.1.1
DNS=8.8.8.8
Domains=~.
EOF

# Restart systemd-networkd
sudo systemctl restart systemd-networkd
```

---

1. **Install dependencies**

### Option A: NodeSource Repository (Recommended for Latest Node.js)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x LTS from NodeSource (includes npm)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
node -v
npm -v

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

**Important for Ubuntu 24.04:** The NodeSource `nodejs` package includes npm. Do NOT attempt to install npm separately with `sudo apt install npm` as this can cause dependency conflicts.

### Option B: Ubuntu Default Repository (Stable, Easier)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm from Ubuntu repository
sudo apt install -y nodejs npm

# Verify installations
node -v
npm -v

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

**Note:** The Ubuntu default repository typically provides an older but stable version of Node.js. This method is simpler and works reliably, but for the latest features use Option A.

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
npm install --production
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

6. **Set up SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```
