| Directory          | Purpose                                                                         |
| ------------------ | ------------------------------------------------------------------------------- |
| `/`                | Top-level filesystem                                                            |
| `/bin`             | Essential user commands                                                         |
| `/sbin`            | Essential system/admin commands                                                 |
| `/boot`            | Kernel and bootloader files                                                     |
| `/dev`             | Device files                                                                    |
| `/etc`             | System/application configuration                                                |
| `/home`            | Normal users' home directories                                                  |
| `/root`            | Root user's home directory                                                      |
| `/lib`, `/lib64`   | System libraries                                                                |
| `/opt`             | Optional/third-party software                                                   |
| `/proc`            | Virtual filesystem containing process/kernel information                        |
| `/run`             | Runtime state of services/processes                                             |
| `/srv`             | Data served by system services                                                  |
| `/sys`             | Kernel/device information                                                       |
| `/tmp`             | Temporary files                                                                 |
| `/usr`             | Most installed programs/libraries                                               |
| `/var`             | Variable data: logs, databases, caches, websites, etc.                          |
| `/mnt`             | Temporary mount points                                                          |
| `/media`           | Removable media                                                                 |
| `/lost+found`      | Files recovered by filesystem checks                                            |
| `/backup`          | Server-specific backup directory                                                |
| `/scripts`         | Server-specific scripts                                                         |
| `/backend`         | **Not a standard Linux directory**; likely created by your hosting/server setup |
| `/error_log`       | **Not standard**; likely a server/application log                               |
| `/razor-agent.log` | Log created by a server/monitoring/security agent                               |
| `/quota.user`      | Filesystem quota information                                                    |
| `/nonexistent`     | Usually a special-purpose empty/non-login user's home                           |




// ============================================================
// LINUX & DEVOPS
// Practical Backend / Production / Interview Reference
// Focus: Node.js + PostgreSQL + Nginx/Apache + Servers + DevOps
// ============================================================


// ============================================================
// 1. SYSTEM INFORMATION
// ============================================================

// OS / kernel
uname -a
uname -r

// Linux distribution
cat /etc/os-release

// CPU
lscpu
nproc

// Memory
free -h

// Disk
df -h

// Directory size
du -sh /var/log
du -sh /var/www/*

// Current user
whoami

// Logged-in users
who

// Current date/time
date

// Hostname
hostname

// Uptime/load
uptime


// ============================================================
// 2. PACKAGE MANAGEMENT — UBUNTU/DEBIAN
// ============================================================

// Update package index
sudo apt update

// Upgrade packages
sudo apt upgrade

// Install
sudo apt install nginx

// Remove
sudo apt remove nginx

// Search
apt search nginx

// Show installed package
apt list --installed | grep nginx

// Find package information
apt show nginx


// ============================================================
// 3. FILESYSTEM — NAVIGATION
// ============================================================

pwd
ls
ls -la

cd /var/www
cd ..
cd ~

// Important paths:
//
// /
// /home
// /root
// /etc
// /var
// /var/log
// /tmp
// /usr
// /opt
// /srv
// /dev
// /proc
// /sys


// ============================================================
// 4. FILE / DIRECTORY OPERATIONS
// ============================================================

// Create file
touch app.log

// Create directory
mkdir app

// Create nested directories
mkdir -p /var/www/myapp/logs

// Copy
cp file.txt backup.txt
cp -r app app-backup

// Move / rename
mv old.txt new.txt
mv app /var/www/

// Delete
rm file.txt

// WARNING: destructive
rm -rf directory/

// Read
cat file.txt

// First/last lines
head file.txt
tail file.txt

// Follow changing file
tail -f app.log

// Search inside file
grep "ERROR" app.log

// Recursive search
grep -R "DATABASE_URL" /var/www/myapp

// Find files
find /var/www -name "*.log"

// Find by type
find /var/www -type f
find /var/www -type d


// ============================================================
// 5. FILE PERMISSIONS
// ============================================================

// Example:
//
// -rwxr-xr-x
//  ||| ||| |||
//  ||| ||| +-- others
//  ||| +------ group
//  +---------- owner

// Numeric:
// r = 4
// w = 2
// x = 1

// 755:
// owner  = rwx = 7
// group  = r-x = 5
// others = r-x = 5

chmod 755 script.sh
chmod 644 config.txt

// Recursive
chmod -R 755 /var/www/myapp

// WARNING:
// Avoid chmod -R 777 in production.


// ============================================================
// 6. OWNERSHIP
// ============================================================

// Show owner/group
ls -la

// Change owner
sudo chown user:user file

// Change recursively
sudo chown -R www-data:www-data /var/www/myapp

// Change group only
sudo chgrp www-data file

// Common web-server user on Ubuntu/Debian:
// www-data


// ============================================================
// 7. USERS / GROUPS
// ============================================================

// Current user
whoami

// User information
id

// Add user
sudo adduser deploy

// Delete user
sudo deluser deploy

// Add group
sudo groupadd developers

// Add user to group
sudo usermod -aG developers deploy

// Show groups
groups

// WARNING:
// User/group changes may require a new login session.


// ============================================================
// 8. SUDO
// ============================================================

// Run command as root
sudo command

// Open root shell
sudo -i

// Check sudo permissions
sudo -l

// Avoid running applications unnecessarily as root.


// ============================================================
// 9. PROCESSES
// ============================================================

// List processes
ps aux

// Search process
ps aux | grep node

// Interactive process monitor
top

// Better interactive monitor if installed
htop

// Find process by name
pgrep node

// Find PID
pidof node

// Kill process
kill PID

// Force kill
kill -9 PID

// WARNING:
// SIGKILL (-9) prevents graceful cleanup.
// Prefer normal kill first.


// ============================================================
// 10. SIGNALS
// ============================================================

// Common signals:
//
// SIGTERM  15 → graceful termination
// SIGINT    2 → interrupt
// SIGKILL   9 → force kill
// SIGHUP    1 → hangup/reload in some applications

kill -15 PID
kill -2 PID

// Prefer SIGTERM for production application shutdown.


// ============================================================
// 11. NODE.JS PROCESS MANAGEMENT
// ============================================================

// Check Node
node -v
npm -v

// Find Node process
ps aux | grep node

// Find Node listening port
ss -ltnp | grep node

// Run application
node dist/server.js

// Environment
NODE_ENV=production node dist/server.js

// Better production approach:
// systemd / Docker / process manager


// ============================================================
// 12. SYSTEMD — SERVICES
// ============================================================

// Service status
sudo systemctl status nginx

// Start
sudo systemctl start nginx

// Stop
sudo systemctl stop nginx

// Restart
sudo systemctl restart nginx

// Reload configuration
sudo systemctl reload nginx

// Enable at boot
sudo systemctl enable nginx

// Disable at boot
sudo systemctl disable nginx

// Check if enabled
systemctl is-enabled nginx

// Check if active
systemctl is-active nginx


// ============================================================
// 13. SYSTEMD — NODE.JS APPLICATION
// ============================================================

// /etc/systemd/system/myapp.service

[Unit]
Description=Node.js API
After=network.target

[Service]
Type=simple

User=deploy
WorkingDirectory=/var/www/myapp

ExecStart=/usr/bin/node /var/www/myapp/dist/server.js

Restart=always
RestartSec=5

Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target


// Apply changes:
sudo systemctl daemon-reload

// Start:
sudo systemctl start myapp

// Enable boot:
sudo systemctl enable myapp

// Status:
sudo systemctl status myapp

// Logs:
sudo journalctl -u myapp

// Follow:
sudo journalctl -u myapp -f

// Recent logs:
sudo journalctl -u myapp -n 100


// ============================================================
// 14. JOURNALCTL
// ============================================================

// Service logs
journalctl -u nginx

// Follow
journalctl -u nginx -f

// Last 100 lines
journalctl -u nginx -n 100

// Since today
journalctl -u nginx --since today

// Kernel logs
journalctl -k

// Boot logs
journalctl -b


// ============================================================
// 15. ENVIRONMENT VARIABLES
// ============================================================

// Current environment
env

// Search
env | grep NODE

// Single variable
echo $PATH

// Temporary variable
export NODE_ENV=production

// Run command with variable
NODE_ENV=production node server.js

// Persistent shell configuration:
// ~/.bashrc
// ~/.profile

// Application secrets should preferably be managed through
// deployment secrets/environment configuration rather than
// committed to Git.


// ============================================================
// 16. PATH
// ============================================================

echo $PATH

which node
which npm
which nginx

// Add directory temporarily
export PATH="$PATH:/custom/bin"


// ============================================================
// 17. NETWORKING — BASIC
// ============================================================

// Interfaces
ip addr

// Routes
ip route

// Connectivity
ping 8.8.8.8

// DNS test
ping google.com

// DNS
dig example.com

// Alternative
nslookup example.com


// ============================================================
// 18. PORTS / LISTENING SERVICES
// ============================================================

// Show TCP/UDP listeners
ss -ltnup

// TCP listeners
ss -ltnp

// Specific port
ss -ltnp | grep :3000

// Find process using port
sudo lsof -i :3000

// Example:
//
// :80   → HTTP
// :443  → HTTPS
// :22   → SSH
// :3000 → common Node.js application port
// :5432 → PostgreSQL
// :6379 → Redis


// ============================================================
// 19. CURL
// ============================================================

// Basic request
curl https://example.com

// Headers only
curl -I https://example.com

// Verbose
curl -v https://example.com

// GET
curl https://api.example.com/users

// POST JSON
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John"}'

// Authorization
curl https://api.example.com/users \
  -H "Authorization: Bearer TOKEN"

// Follow redirects
curl -L http://example.com


// ============================================================
// 20. SSH
// ============================================================

// Connect
ssh user@server-ip

// Custom port
ssh -p 2222 user@server-ip

// SSH key
ssh -i ~/.ssh/id_ed25519 user@server-ip

// Copy file
scp file.txt user@server:/tmp/

// Copy directory
scp -r app/ user@server:/var/www/

// SSH config:
// ~/.ssh/config

Host production
    HostName server.example.com
    User deploy
    IdentityFile ~/.ssh/id_ed25519

// Then:
ssh production


// ============================================================
// 21. SSH KEY BASICS
// ============================================================

// Generate modern key
ssh-keygen -t ed25519

// Public key
cat ~/.ssh/id_ed25519.pub

// Test
ssh -T git@github.com

// Never share:
// ~/.ssh/id_ed25519

// Public key can be shared.
// Private key must remain private.


// ============================================================
// 22. GIT — DAILY BACKEND WORKFLOW
// ============================================================

git clone <repository>

git status

git add .

git commit -m "Add authentication"

git pull

git push

git branch

git switch -c feature/auth

git switch main

git merge feature/auth

// View history
git log --oneline

// Show changes
git diff

// Show staged changes
git diff --staged


// ============================================================
// 23. GIT RECOVERY
// ============================================================

// Unstage
git restore --staged file.js

// Discard working-tree changes
// WARNING: destructive
git restore file.js

// Undo commit with new commit
git revert <commit>

// Reset local commit/history
// WARNING: understand the consequences first
git reset --soft HEAD~1
git reset --hard HEAD~1

// Stash
git stash
git stash pop
git stash list


// ============================================================
// 24. GIT .gitignore
// ============================================================

node_modules/
.env
.env.*
dist/
coverage/
*.log

// Never commit:
// - passwords
// - API keys
// - database credentials
// - private keys


// ============================================================
// 25. NGINX — INSTALLATION
// ============================================================

sudo apt update
sudo apt install nginx

sudo systemctl status nginx

// Configuration:
sudo nginx -t

// Reload:
sudo systemctl reload nginx


// ============================================================
// 26. NGINX CONFIGURATION STRUCTURE
// ============================================================

// Main:
// /etc/nginx/nginx.conf

// Sites:
// /etc/nginx/sites-available/
// /etc/nginx/sites-enabled/

// Logs:
// /var/log/nginx/access.log
// /var/log/nginx/error.log


// ============================================================
// 27. NGINX — NODE.JS REVERSE PROXY
// ============================================================

// /etc/nginx/sites-available/myapp

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For
            $proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


// Enable:
sudo ln -s /etc/nginx/sites-available/myapp \
    /etc/nginx/sites-enabled/myapp

sudo nginx -t
sudo systemctl reload nginx


// ============================================================
// 28. NGINX — FRONTEND + API
// ============================================================

server {
    listen 80;
    server_name example.com;

    root /var/www/frontend;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}


// ============================================================
// 29. NGINX — HTTPS
// ============================================================

// Typical:
//
// Client HTTPS
//      ↓
// Nginx
//      ↓
// Node.js HTTP/private network

server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}


// HTTP → HTTPS:
server {
    listen 80;
    server_name example.com;

    return 301 https://$host$request_uri;
}


// ============================================================
// 30. NGINX — IMPORTANT DIRECTIVES
// ============================================================

// Core:
server
listen
server_name
location

// Files:
root
index
try_files

// Proxy:
proxy_pass
proxy_set_header
proxy_http_version

// Limits:
client_max_body_size
proxy_connect_timeout
proxy_read_timeout

// Security:
add_header

// Load balancing:
upstream

// Rate limiting:
limit_req_zone
limit_req

// Compression:
gzip

// Logs:
access_log
error_log


// ============================================================
// 31. NGINX — LOAD BALANCING
// ============================================================

upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;

    location / {
        proxy_pass http://backend;
    }
}

// Default:
// round-robin

// Common alternative:
upstream backend {
    least_conn;

    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}


// ============================================================
// 32. NGINX — RATE LIMITING
// ============================================================

http {
    limit_req_zone $binary_remote_addr
        zone=api_limit:10m
        rate=10r/s;

    server {
        location /api/ {
            limit_req zone=api_limit burst=20;

            proxy_pass http://127.0.0.1:3000;
        }
    }
}


// ============================================================
// 33. NGINX — LOGS / TROUBLESHOOTING
// ============================================================

sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

sudo nginx -t

// 502 debugging:
curl http://127.0.0.1:3000
ss -ltnp | grep :3000

// If direct backend request fails:
// → Node.js/application problem.

// If direct request works:
// → investigate Nginx/proxy configuration.


// ============================================================
// 34. APACHE — INSTALLATION
// ============================================================

sudo apt update
sudo apt install apache2

sudo systemctl status apache2

sudo apache2ctl configtest


// ============================================================
// 35. APACHE — IMPORTANT PATHS
// ============================================================

// Main:
// /etc/apache2/apache2.conf

// Sites:
// /etc/apache2/sites-available/
// /etc/apache2/sites-enabled/

// Modules:
// /etc/apache2/mods-available/
// /etc/apache2/mods-enabled/

// Logs:
// /var/log/apache2/access.log
// /var/log/apache2/error.log


// ============================================================
// 36. APACHE — VIRTUALHOST
// ============================================================

<VirtualHost *:80>

    ServerName example.com
    ServerAlias www.example.com

    DocumentRoot /var/www/myapp

    <Directory /var/www/myapp>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/myapp-error.log
    CustomLog ${APACHE_LOG_DIR}/myapp-access.log combined

</VirtualHost>


// Enable:
sudo a2ensite myapp.conf

// Disable:
sudo a2dissite myapp.conf

// Test:
sudo apache2ctl configtest

// Reload:
sudo systemctl reload apache2


// ============================================================
// 37. APACHE — REVERSE PROXY
// ============================================================

<VirtualHost *:80>

    ServerName api.example.com

    ProxyPreserveHost On

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

</VirtualHost>


// Enable modules:
sudo a2enmod proxy
sudo a2enmod proxy_http


// ============================================================
// 38. APACHE — LARAVEL/PHP-FPM
// ============================================================

// Typical:
//
// Client
//   ↓
// Apache
//   ↓
// PHP-FPM
//   ↓
// Laravel
//   ↓
// PostgreSQL/MySQL

// Laravel DocumentRoot should normally be:
// /var/www/app/public

// Important:
// mod_rewrite
// PHP-FPM
// VirtualHost
// .htaccess


// ============================================================
// 39. APACHE — IMPORTANT COMMANDS
// ============================================================

sudo apache2ctl configtest
sudo apache2ctl -S
sudo apache2ctl -M

sudo a2ensite app.conf
sudo a2dissite app.conf

sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl

sudo systemctl reload apache2

sudo tail -f /var/log/apache2/error.log


// ============================================================
// 40. FIREWALL — UFW
// ============================================================

// Status
sudo ufw status

// Enable
sudo ufw enable

// Allow SSH
sudo ufw allow 22/tcp

// Allow HTTP
sudo ufw allow 80/tcp

// Allow HTTPS
sudo ufw allow 443/tcp

// Remove rule
sudo ufw delete allow 80/tcp

// WARNING:
// Ensure SSH access is allowed before enabling a remote firewall.


// Typical production:
//
// Public:
// 22 → SSH (prefer restricted source/IP)
// 80 → HTTP
// 443 → HTTPS
//
// Private:
// 3000 → Node.js
// 5432 → PostgreSQL
// 6379 → Redis


// ============================================================
// 41. DO NOT EXPOSE INTERNAL SERVICES
// ============================================================

// Usually:
//
// Internet
//   ↓
// :443
//   ↓
// Nginx
//   ↓
// :3000 Node.js
//   ↓
// :5432 PostgreSQL
//
// Not:
//
// Internet → :3000
// Internet → :5432
// Internet → :6379


// ============================================================
// 42. POSTGRESQL — INSTALLATION
// ============================================================

sudo apt update
sudo apt install postgresql postgresql-contrib

sudo systemctl status postgresql


// ============================================================
// 43. POSTGRESQL — PSQL
// ============================================================

// Enter PostgreSQL shell:
sudo -u postgres psql

// Connect:
psql -h localhost -U postgres -d mydb

// Database list:
\l

// Connect database:
\c mydb

// Tables:
\dt

// Describe table:
\d users

// Quit:
\q


// ============================================================
// 44. POSTGRESQL — DATABASE / USER
// ============================================================

// Create database:
CREATE DATABASE myapp;

// Create user:
CREATE USER myapp_user WITH PASSWORD 'CHANGE_ME';

// Grant:
GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;

// Prefer dedicated application users.
// Do not use postgres superuser from the application.


// ============================================================
// 45. POSTGRESQL — BASIC SQL
// ============================================================

// CREATE
INSERT INTO users (name, email)
VALUES ('John', 'john@example.com');

// READ
SELECT id, name, email
FROM users;

// FILTER
SELECT *
FROM users
WHERE id = 10;

// UPDATE
UPDATE users
SET name = 'Jane'
WHERE id = 10;

// DELETE
// WARNING: destructive
DELETE FROM users
WHERE id = 10;

// COUNT
SELECT COUNT(*)
FROM users;


// ============================================================
// 46. POSTGRESQL — INDEX
// ============================================================

CREATE INDEX idx_users_email
ON users(email);

// Unique:
CREATE UNIQUE INDEX idx_users_email_unique
ON users(email);

// Check query:
EXPLAIN SELECT *
FROM users
WHERE email = 'john@example.com';

EXPLAIN ANALYZE
SELECT *
FROM users
WHERE email = 'john@example.com';

// Important:
// Indexes speed reads for suitable queries but add write/storage
// overhead.


// ============================================================
// 47. POSTGRESQL — TRANSACTION
// ============================================================

BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;

// Rollback:
ROLLBACK;


// ============================================================
// 48. POSTGRESQL — LOCK / CONCURRENCY BASICS
// ============================================================

// Row lock:
SELECT *
FROM accounts
WHERE id = 1
FOR UPDATE;

// Useful when:
// read → modify → write
// must be protected from concurrent transactions.

// Know:
//
// MVCC
// transactions
// isolation
// locks
// deadlocks
// row-level locking


// ============================================================
// 49. POSTGRESQL — NODE.JS CONNECTION
// ============================================================

// npm:
// npm install pg

import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,
});

const result = await pool.query(
    "SELECT id, name FROM users WHERE id = $1",
    [10]
);

console.log(result.rows);

await pool.end();


// NEVER:
//
// `SELECT * FROM users WHERE id = ${id}`
//
// Use parameterized queries:
// $1, $2, ...


/* ============================================================
   50. NODE.JS + POSTGRES ARCHITECTURE
   ============================================================

   Client
      ↓
   Nginx
      ↓
   Node.js
      ↓
   pg Pool
      ↓
   PostgreSQL
*/


// ============================================================
// 51. POSTGRESQL CONNECTION POOLING
// ============================================================

// Application should normally use a pool rather than opening a
// brand-new database connection for every request.

// Important pool concepts:
//
// max
// idle timeout
// connection timeout
// acquire/release
// pool exhaustion

// With transactions:

const client = await pool.connect();

try {
    await client.query("BEGIN");

    await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [100, 1]);

    await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [100, 2]);

    await client.query("COMMIT");
} catch (error) {
    await client.query("ROLLBACK");
    throw error;
} finally {
    client.release();
}


// ============================================================
// 52. DOCKER — CORE CONCEPTS
// ============================================================

// Image:
// immutable application/package template.

// Container:
// running instance of an image.

// Volume:
// persistent storage.

// Network:
// communication between containers.

// Dockerfile:
// instructions for building an image.

// Compose:
// multi-container application definition.


// ============================================================
// 53. DOCKER — COMMON COMMANDS
// ============================================================

// Version
docker --version

// Images
docker images

// Containers
docker ps
docker ps -a

// Pull
docker pull postgres

// Run
docker run --name postgres-db postgres

// Start
docker start postgres-db

// Stop
docker stop postgres-db

// Remove
// WARNING: removes container
docker rm postgres-db

// Logs
docker logs postgres-db
docker logs -f postgres-db

// Execute command
docker exec -it postgres-db bash

// Inspect
docker inspect postgres-db


// ============================================================
// 54. DOCKER — BUILD / RUN NODE.JS
// ============================================================

// Dockerfile:

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]


// Build:
docker build -t myapp .

// Run:
docker run -p 3000:3000 myapp


// ============================================================
// 55. DOCKER — ENVIRONMENT
// ============================================================

docker run \
    -e NODE_ENV=production \
    -e PORT=3000 \
    -p 3000:3000 \
    myapp

// Never bake production secrets into an image.


// ============================================================
// 56. DOCKER COMPOSE
// ============================================================

// compose.yaml

services:

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: app
      DB_USER: app
      DB_PASSWORD: change-me
    depends_on:
      - postgres

  postgres:
    image: postgres:latest
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: change-me
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:


// Start:
docker compose up -d

// Logs:
docker compose logs -f

// Stop:
docker compose down

// WARNING:
// `docker compose down -v` removes declared volumes.
// This can destroy database data.


// ============================================================
// 57. DOCKER — HEALTH CHECK
// ============================================================

healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
    interval: 30s
    timeout: 5s
    retries: 3


// ============================================================
// 58. DOCKER — NETWORKING
// ============================================================

// Inside Compose:
//
// app → postgres:5432
//
// NOT:
//
// app → localhost:5432

// `localhost` inside a container means that same container.

// Service names become DNS names in a Compose network.


// ============================================================
// 59. DOCKER — VOLUMES
// ============================================================

// List:
docker volume ls

// Inspect:
docker volume inspect postgres_data

// Persistent database storage:
// container → volume → host-managed storage


// ============================================================
// 60. DOCKER — CLEANUP
// ============================================================

// Dangling images
docker image prune

// Stopped containers
docker container prune

// WARNING:
// Prune commands delete unused resources.


// ============================================================
// 61. CI/CD — BASIC PIPELINE
// ============================================================

/*
Developer
   ↓
Git push
   ↓
CI
   ↓
Install dependencies
   ↓
Lint
   ↓
Unit tests
   ↓
Build
   ↓
Docker image / artifact
   ↓
Deploy
   ↓
Health check
   ↓
Production
*/


// ============================================================
// 62. DEPLOYMENT CHECKLIST
// ============================================================

/*
[ ] Pull latest code
[ ] Install dependencies
[ ] Set production environment
[ ] Run tests
[ ] Build application
[ ] Run migrations safely
[ ] Restart/reload application
[ ] Verify service
[ ] Verify logs
[ ] Verify health endpoint
[ ] Verify database
[ ] Verify Nginx/Apache
[ ] Verify HTTPS
[ ] Monitor errors
*/


// ============================================================
// 63. ZERO-DOWNTIME DEPLOYMENT — CONCEPT
// ============================================================

/*
Old version
    ↓
Load Balancer / Nginx
    ↓
New version starts
    ↓
Health check passes
    ↓
Traffic gradually moves
    ↓
Old version terminates
*/

// Common strategies:
//
// rolling deployment
// blue-green deployment
// canary deployment


// ============================================================
// 64. DATABASE MIGRATION SAFETY
// ============================================================

// Avoid blindly deploying destructive schema changes.

// Safer pattern:
//
// 1. Add new nullable column
// 2. Deploy application supporting both versions
// 3. Backfill data
// 4. Switch application
// 5. Remove old column later

// Important for zero-downtime deployments.


// ============================================================
// 65. LOGGING / OBSERVABILITY
// ============================================================

// Application should produce structured logs where practical.
//
// Include:
//
// timestamp
// level
// request ID
// route
// status
// duration
// error information

// Avoid logging:
//
// passwords
// tokens
// API keys
// session secrets
// sensitive personal data


// ============================================================
// 66. CPU / MEMORY / DISK DEBUGGING
// ============================================================

// CPU:
top

// Memory:
free -h

// Disk:
df -h

// Directory usage:
du -sh /var/*

// Top CPU processes:
ps aux --sort=-%cpu | head

// Top memory processes:
ps aux --sort=-%mem | head


// ============================================================
// 67. DISK FULL TROUBLESHOOTING
// ============================================================

df -h

du -sh /* 2>/dev/null

du -sh /var/log/*

journalctl --disk-usage

// Look for:
// - logs
// - Docker images
// - Docker volumes
// - temporary files
// - application uploads
// - database files

// WARNING:
// Never manually delete database files to free disk space.


// ============================================================
// 68. MEMORY TROUBLESHOOTING
// ============================================================

free -h

ps aux --sort=-%mem | head

// For Node.js:
ps aux | grep node

// Check process resource usage:
top -p PID

// Investigate:
// - memory leak
// - unbounded cache
// - large requests
// - too many processes
// - database connections


// ============================================================
// 69. CPU TROUBLESHOOTING
// ============================================================

top

ps aux --sort=-%cpu | head

// Ask:
//
// Which process?
// Is CPU consistently high?
// Is workload expected?
// Is database consuming CPU?
// Is application stuck in CPU-heavy work?
// Is there a traffic spike?


// ============================================================
// 70. NETWORK TROUBLESHOOTING
// ============================================================

// DNS:
dig example.com

// Route:
ip route

// Interface:
ip addr

// Listening:
ss -ltnp

// HTTP:
curl -v http://127.0.0.1:3000

// TLS:
curl -v https://example.com

// Port connectivity:
nc -vz host 5432

// Useful debugging chain:
//
// DNS
// ↓
// routing
// ↓
// firewall
// ↓
// port
// ↓
// service
// ↓
// application


// ============================================================
// 71. PORT CONFLICT
// ============================================================

// Error:
// EADDRINUSE

// Find process:
sudo lsof -i :3000

// Or:
sudo ss -ltnp | grep :3000

// Inspect:
ps -fp PID

// Stop gracefully:
kill PID

// Force only if necessary:
// WARNING
kill -9 PID


// ============================================================
// 72. 502 BAD GATEWAY
// ============================================================

/*
Client
  ↓
Nginx
  ↓
Node.js
*/

// Check:

sudo nginx -t

sudo tail -f /var/log/nginx/error.log

systemctl status myapp

ss -ltnp | grep :3000

curl http://127.0.0.1:3000

// If curl fails:
// → Node.js/application problem.

// If curl succeeds:
// → Nginx/proxy/network configuration problem.


// ============================================================
// 73. 504 GATEWAY TIMEOUT
// ============================================================

/*
Nginx
  ↓
Node.js
  ↓
Database / External API
  ↓
Too slow
*/

 // Investigate:
 //
 // application latency
 // database query
 // external API
 // connection pool
 // CPU/memory
 // proxy timeout

// Do NOT simply increase timeout without finding the bottleneck.


// ============================================================
// 74. PERMISSION DENIED
// ============================================================

// Inspect:
ls -la /path

// Inspect parent directories:
namei -l /path/to/file

// Check current user:
whoami

// Fix owner:
sudo chown -R deploy:deploy /var/www/myapp

// For web-server-owned writable directory:
sudo chown -R www-data:www-data /var/www/myapp/storage

// Use minimum required permissions.


// ============================================================
// 75. SERVICE WON'T START
// ============================================================

// Status:
systemctl status myapp

// Logs:
journalctl -u myapp -n 100

// Follow:
journalctl -u myapp -f

// Check configuration:
// Nginx:
nginx -t

// Apache:
apache2ctl configtest

// Check port:
ss -ltnp

// Check executable:
which node

// Check permissions:
ls -la /var/www/myapp


// ============================================================
// 76. DNS DEBUGGING
// ============================================================

dig example.com

dig A example.com
dig AAAA example.com

dig MX example.com

// Ask a specific DNS server:
dig @8.8.8.8 example.com

// Check:
// - correct IP
// - TTL
// - A/AAAA records
// - DNS propagation
// - domain configuration


// ============================================================
// 77. TLS / HTTPS DEBUGGING
// ============================================================

// HTTP headers:
curl -I https://example.com

// Detailed:
curl -v https://example.com

// OpenSSL:
openssl s_client -connect example.com:443 \
    -servername example.com

// Check:
// - certificate
// - hostname
// - expiration
// - TLS handshake
// - redirect
// - proxy configuration


// ============================================================
// 78. PROCESS VS THREAD — INTERVIEW
// ============================================================

/*
PROCESS:
- independent memory space
- heavier isolation
- has PID
- communication requires IPC mechanisms

THREAD:
- execution unit inside process
- shares process memory
- lighter than separate processes

Node.js:
- JavaScript execution normally occurs on the main thread.
- Node uses asynchronous I/O and a thread pool for certain
  operations.
*/


// ============================================================
// 79. NODE.JS EVENT LOOP — INTERVIEW
// ============================================================

/*
Incoming request
      ↓
Node.js event loop
      ↓
Non-blocking I/O
      ↓
Callback / Promise continuation
      ↓
Response

CPU-heavy synchronous work blocks the event loop.

Database/network I/O can be asynchronous.
*/


// ============================================================
// 80. TCP / HTTP — INTERVIEW
// ============================================================

/*
HTTP:
Application-layer protocol.

TCP:
Reliable transport connection.

Typical HTTPS:

HTTP
 ↓
TLS
 ↓
TCP
 ↓
IP
*/


// ============================================================
// 81. DNS — INTERVIEW
// ============================================================

/*
example.com
    ↓
DNS lookup
    ↓
IP address
    ↓
TCP connection
    ↓
TLS
    ↓
HTTP request
*/


// ============================================================
// 82. REVERSE PROXY — INTERVIEW
// ============================================================

/*
Client
  ↓
Reverse Proxy
  ↓
Backend

Reverse proxy can provide:

- TLS termination
- routing
- load balancing
- caching
- compression
- rate limiting
- security controls
- hiding backend topology
*/


// ============================================================
// 83. LOAD BALANCING — INTERVIEW
// ============================================================

/*
             Load Balancer
             /     |     \
            ↓      ↓      ↓
          API1   API2   API3
*/

 // Common strategies:
 //
 // round robin
 // least connections
 // IP hash
 // weighted routing

// Horizontal scaling:
// add more application instances.

// Vertical scaling:
// increase CPU/RAM of existing server.


// ============================================================
// 84. CONNECTION POOLING — INTERVIEW
// ============================================================

/*
Without pooling:

Request
 ↓
Create DB connection
 ↓
Query
 ↓
Close connection

With pooling:

Application
     ↓
Connection Pool
 ↓   ↓   ↓   ↓
DB connections

Reuse connections instead of creating one for every request.
*/


// ============================================================
// 85. CACHING — INTERVIEW
// ============================================================

/*
Client
 ↓
CDN / Reverse Proxy
 ↓
Redis
 ↓
Application
 ↓
Database
*/

// Cache useful data when:
// - reads are frequent
// - data changes less frequently
// - latency matters

// Problems:
// - stale data
// - invalidation
// - memory limits
// - cache stampede


// ============================================================
// 86. SCALING — INTERVIEW
// ============================================================

/*
Vertical:

1 server
↓
more CPU/RAM


Horizontal:

1 server
↓
3 application servers
↓
load balancer
*/

// Stateless APIs are easier to horizontally scale.

// Avoid storing request-specific session state only in local
// process memory when multiple instances need to share it.


// ============================================================
// 87. HEALTH CHECKS
// ============================================================

// Application:

GET /health

// Liveness:
// "Is the application process alive?"

// Readiness:
// "Can the application accept traffic?"

// Readiness may check:
// - database
// - required dependencies
// - startup state


// ============================================================
// 88. GRACEFUL SHUTDOWN — NODE.JS
// ============================================================

process.on("SIGTERM", async () => {
    console.log("Shutting down...");

    // Stop accepting new work.
    // Close HTTP server.
    // Close database pool.
    // Close other resources.

    process.exit(0);
});

// Important in:
// - Docker
// - Kubernetes
// - systemd
// - rolling deployments


// ============================================================
// 89. PRODUCTION ENVIRONMENT SEPARATION
// ============================================================

// Development:
NODE_ENV=development

// Production:
NODE_ENV=production

// Keep environment-specific configuration outside source code
// where practical.


// ============================================================
// 90. SECRETS
// ============================================================

// NEVER:
//
// DB_PASSWORD=secret
//
// inside committed source code.

// Better:
//
// process.env.DB_PASSWORD

// Or use:
// - CI/CD secrets
// - secret managers
// - environment injection
// - deployment platform secrets

// If a secret is committed:
// rotate/revoke it.
// Removing it from Git alone does not make the leaked secret safe.


// ============================================================
// 91. BACKUP BASICS
// ============================================================

// PostgreSQL logical backup:
pg_dump -U postgres mydb > backup.sql

// Restore:
psql -U postgres mydb < backup.sql

// Custom format:
pg_dump -Fc -U postgres mydb > backup.dump

// Restore:
pg_restore -U postgres -d mydb backup.dump

// WARNING:
// Test restoration.
// A backup that has never been restored/tested is not a reliable
// recovery strategy.


// ============================================================
// 92. DATABASE BACKUP STRATEGY
// ============================================================

/*
Production:

Database
   ↓
Automated backup
   ↓
Separate storage
   ↓
Retention
   ↓
Restore testing

Consider:

- frequency
- retention
- encryption
- off-server storage
- point-in-time recovery
- restore time
*/


// ============================================================
// 93. DISASTER RECOVERY — INTERVIEW
// ============================================================

// RPO:
// Maximum acceptable amount of data loss.

// RTO:
// Maximum acceptable recovery time.

// Example:
//
// RPO = 5 minutes
// RTO = 30 minutes

// Architecture should be designed around business requirements.


// ============================================================
// 94. ZERO-DOWNTIME ARCHITECTURE
// ============================================================

/*
                 Load Balancer
                 /           \
                ↓             ↓
             Node v1       Node v2
                              ↓
                         New version

Deploy:
1. Start new instance
2. Health check
3. Add to traffic
4. Remove old instance
5. Stop old instance
*/


// ============================================================
// 95. COMMON PRODUCTION MISTAKES
// ============================================================

// WRONG:
// Run Node.js as root.

// BETTER:
// Run with dedicated low-privilege user.


// WRONG:
// Expose PostgreSQL to the internet.

// BETTER:
// Private network/firewall + application access.


// WRONG:
// Store .env in Git.

// BETTER:
// Environment/secret management.


// WRONG:
// chmod 777 everything.

// BETTER:
// Least privilege.


 // WRONG:
// Kill production applications with kill -9 immediately.

// BETTER:
// SIGTERM → graceful shutdown → force only if necessary.


// WRONG:
// Increase timeout to hide slow queries.

// BETTER:
// Measure application/database latency and fix bottleneck.


// WRONG:
// Create a PostgreSQL connection for every request.

// BETTER:
// Use connection pooling.


// WRONG:
// Run database migrations blindly during deployment.

// BETTER:
// Use backward-compatible migration strategy for important
// production systems.


// WRONG:
// Assume high CPU means "need more servers".

// BETTER:
// Identify the process and workload causing CPU usage.


// ============================================================
// 96. PRACTICAL PRODUCTION ARCHITECTURE
// ============================================================

/*
                       INTERNET
                           |
                           v
                    DNS / CDN
                           |
                           v
                    Firewall / LB
                           |
                           v
                    Nginx :443
                           |
                           v
             +-------------+-------------+
             |             |             |
             v             v             v
          Node.js       Node.js       Node.js
             |             |             |
             +-------------+-------------+
                           |
                           v
                    Connection Pool
                           |
                           v
                      PostgreSQL

                    + Redis Cache
                    + Object Storage
                    + Monitoring
                    + Central Logs
*/


// ============================================================
// 97. TROUBLESHOOTING DECISION TREE
// ============================================================

/*
USER SAYS:
"API IS DOWN"

        ↓

Can DNS resolve?
        |
       NO → DNS problem
        |
       YES
        ↓

Can port 443 connect?
        |
       NO → firewall/network/TLS
        |
       YES
        ↓

Nginx/Apache running?
        |
       NO → service problem
        |
       YES
        ↓

502?
        |
       YES → upstream/application
        |
       NO
        ↓

504?
        |
       YES → slow upstream/dependency
        |
       NO
        ↓

5xx from application?
        |
       YES → application/logs
        |
       NO
        ↓

Database/dependency?
        |
       YES → investigate dependency
*/


// ============================================================
// 98. IMPORTANT COMMAND CHEATSHEET
// ============================================================

// SYSTEM
uname -a
cat /etc/os-release
uptime
hostname
whoami
id

// CPU/MEMORY/DISK
lscpu
nproc
free -h
df -h
du -sh
top
ps aux

// FILES
pwd
ls -la
cd
cp
mv
rm
mkdir
touch
cat
less
head
tail -f
grep
find

// PERMISSIONS
chmod
chown
chgrp
ls -la
namei -l

// PROCESSES
ps
pgrep
pidof
kill
kill -9

// SERVICES
systemctl
journalctl

// NETWORK
ip addr
ip route
ss -ltnp
lsof -i
ping
dig
nslookup
curl
nc

// SSH
ssh
scp
ssh-keygen

// GIT
git status
git add
git commit
git pull
git push
git switch
git merge
git rebase
git stash
git restore
git revert

// NGINX
nginx -t
systemctl reload nginx

// APACHE
apache2ctl configtest
apache2ctl -S
apache2ctl -M

// POSTGRESQL
psql
pg_dump
pg_restore

// DOCKER
docker ps
docker images
docker logs
docker exec
docker build
docker run
docker stop
docker compose


// ============================================================
// 99. IMPORTANT PRODUCTION PATHS
// ============================================================

// Linux:
/etc/
/var/log/
/var/www/
/home/
/tmp/
/opt/

// Nginx:
/etc/nginx/nginx.conf
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
/var/log/nginx/

// Apache:
/etc/apache2/apache2.conf
/etc/apache2/sites-available/
/etc/apache2/sites-enabled/
/var/log/apache2/

// SSH:
/etc/ssh/sshd_config
~/.ssh/

// systemd:
/etc/systemd/system/

// PostgreSQL configuration varies by version/distribution.
// Find it from psql:
SHOW config_file;
SHOW hba_file;


// ============================================================
// 100. QUICK REFERENCE — MOST IMPORTANT CONCEPTS
// ============================================================

/*
LINUX
-----
process
thread
PID
signal
filesystem
permissions
owner/group
systemd
service
environment variables
logs
CPU
memory
disk
TCP
ports
DNS
SSH
firewall


NETWORKING
----------
DNS
IP
TCP
HTTP
HTTPS
TLS
port
socket
reverse proxy
load balancer
firewall


NGINX
-----
server
location
upstream
proxy_pass
proxy_set_header
try_files
server_name
listen
SSL
rate limiting
caching
compression
logs

502 → upstream communication problem
504 → upstream timeout


APACHE
------
VirtualHost
DocumentRoot
mod_rewrite
.htaccess
mod_proxy
PHP-FPM
MPM
SSL
logs


POSTGRESQL
----------
database
role/user
schema
table
CRUD
index
EXPLAIN
transaction
MVCC
locking
isolation
connection pool
backup/restore


DOCKER
------
image
container
Dockerfile
volume
network
Compose
healthcheck
environment
registry


GIT
---
repository
branch
commit
merge
rebase
remote
stash
reset
revert
cherry-pick
tag


SYSTEMD
-------
systemctl status
systemctl start
systemctl stop
systemctl restart
systemctl reload
systemctl enable
journalctl -u SERVICE -f


DEBUGGING
---------
systemctl status
journalctl -u SERVICE -f
ps aux
top
free -h
df -h
du -sh
ss -ltnp
lsof -i :PORT
curl -v
dig
tail -f
grep


SECURITY
--------
least privilege
SSH keys
firewall
HTTPS
private services
secret management
file permissions
database users
backups
logging


PERFORMANCE
-----------
CPU
memory
disk I/O
network
connection pools
indexes
caching
compression
load balancing
horizontal scaling
vertical scaling


SYSTEM DESIGN
------------
stateless application
reverse proxy
load balancer
horizontal scaling
database
replicas
cache
queue
object storage
observability
health checks
graceful shutdown
backup
RPO
RTO
failure recovery
*/


// ============================================================
// 101. INTERVIEW — QUESTIONS TO KNOW
// ============================================================

/*
1. What happens when you enter https://example.com in a browser?

2. What is DNS?

3. What is TCP?

4. What happens during a TLS handshake?

5. What is a port?

6. What is a socket?

7. What is a reverse proxy?

8. Why put Nginx in front of Node.js?

9. What is load balancing?

10. Horizontal vs vertical scaling?

11. What is a process?

12. Process vs thread?

13. What happens when a Linux process receives SIGTERM?

14. SIGTERM vs SIGKILL?

15. What is systemd?

16. How do you run Node.js automatically after reboot?

17. How do you investigate high CPU?

18. How do you investigate high memory?

19. How do you investigate a full disk?

20. How do you find what process owns port 3000?

21. How do you debug a 502?

22. How do you debug a 504?

23. What is a connection pool?

24. Why shouldn't an application create a new DB connection
    for every request?

25. What is a PostgreSQL transaction?

26. What is MVCC?

27. What is an index?

28. How do you investigate a slow SQL query?

29. What is Docker?

30. Image vs container?

31. Volume vs container filesystem?

32. Why use Docker Compose?

33. What is a health check?

34. What is graceful shutdown?

35. What is zero-downtime deployment?

36. Blue-green vs rolling deployment?

37. What are RPO and RTO?

38. How should production secrets be managed?

39. Why should PostgreSQL normally not be publicly exposed?

40. What happens when a server runs out of disk?


// ============================================================
// 102. FINAL PRODUCTION MENTAL MODEL
// ============================================================

/*
                    USER
                     |
                     v
                    DNS
                     |
                     v
              INTERNET / HTTPS
                     |
                     v
              FIREWALL / LB
                     |
                     v
              NGINX / APACHE
                     |
                     v
              NODE.JS / PHP
                     |
              +------+------+
              |             |
              v             v
           REDIS       POSTGRESQL
              |
              v
           CACHE


When debugging:

1. DNS
2. Network
3. Firewall
4. Port
5. Web server
6. Reverse proxy
7. Application
8. Database/cache/external services
9. CPU/memory/disk
10. Logs


When scaling:

1. Measure
2. Find bottleneck
3. Optimize
4. Cache where appropriate
5. Pool connections
6. Scale application horizontally
7. Add load balancing
8. Scale database appropriately
9. Add observability
10. Design for failure


When deploying:

1. Test
2. Build
3. Configure environment
4. Backup
5. Migrate safely
6. Deploy
7. Health check
8. Shift traffic
9. Monitor
10. Roll back if necessary
*/
