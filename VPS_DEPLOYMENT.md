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
grep -RIn --line-number "repo.virtuozzo.com/ctpreset" /etc/apt/sources.list /etc/apt/sources.list.d || true
sudo sh -c 'grep -RIl "repo.virtuozzo.com/ctpreset" /etc/apt/sources.list /etc/apt/sources.list.d | while read -r f; do mv "$f" "$f.disabled"; done' || true

# Update system
sudo apt update && sudo apt upgrade -y

# Install prerequisites for NodeSource setup
sudo apt install -y curl ca-certificates gnupg

# Install Node.js LTS via NodeSource (includes npm)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
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
