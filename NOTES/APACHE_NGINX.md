https://httpd.apache.org/docs/
https://nginx.org/en/docs/index.html

// ============================================================
// APACHE HTTP SERVER + NGINX
// Practical Backend / Production / Interview Reference
// ============================================================


// ============================================================
// 1. INSTALLATION
// ============================================================

// Ubuntu/Debian

sudo apt update
sudo apt install nginx apache2

// Check versions
nginx -v
apache2 -v

// Service status
sudo systemctl status nginx
sudo systemctl status apache2

// Start / stop / restart
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx

sudo systemctl start apache2
sudo systemctl stop apache2
sudo systemctl restart apache2

// Start automatically after reboot
sudo systemctl enable nginx
sudo systemctl enable apache2


// ============================================================
// 2. NGINX VS APACHE — CORE IDEA
// ============================================================

// Nginx:
// Client → Nginx → Node.js / PHP-FPM / upstream servers

// Apache:
// Client → Apache → PHP-FPM / Node.js / upstream servers

// Common production architecture:
//
// Internet
//    ↓
// Nginx / Apache
//    ↓
// Backend application
//    ↓
// PostgreSQL / MySQL / Redis


// Nginx is commonly used for:
// - reverse proxy
// - static files
// - TLS termination
// - load balancing
// - caching
// - high concurrent connections

// Apache is commonly used for:
// - PHP/Laravel applications
// - VirtualHost
// - .htaccess
// - mod_rewrite
// - reverse proxy
// - PHP-FPM


// ============================================================
// 3. NGINX CONFIGURATION STRUCTURE
// ============================================================

// Main configuration:
// /etc/nginx/nginx.conf

// Common site configuration:
// /etc/nginx/sites-available/
// /etc/nginx/sites-enabled/

// Logs:
// /var/log/nginx/access.log
// /var/log/nginx/error.log


// Test configuration BEFORE reload:
sudo nginx -t

// Reload without dropping existing connections:
sudo systemctl reload nginx

// Restart:
sudo systemctl restart nginx


// ============================================================
// 4. NGINX BASIC SERVER BLOCK
// ============================================================

// /etc/nginx/sites-available/myapp

server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/myapp;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

// Enable site:
sudo ln -s /etc/nginx/sites-available/myapp \
    /etc/nginx/sites-enabled/myapp

// Test:
sudo nginx -t

// Reload:
sudo systemctl reload nginx


// ============================================================
// 5. NGINX REVERSE PROXY — NODE.JS
// ============================================================

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

// Flow:
//
// Client
//   ↓
// Nginx :80
//   ↓
// Node.js :3000


// ============================================================
// 6. NGINX IMPORTANT proxy_* DIRECTIVES
// ============================================================

proxy_pass
proxy_http_version

proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;

// Important:
// Node.js should generally listen on localhost/private network,
// not expose its application port directly to the internet.


// ============================================================
// 7. NGINX STATIC FILES
// ============================================================

server {
    listen 80;
    server_name example.com;

    root /var/www/frontend;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

// Useful for React/Vite SPA.

// Static assets:
location /assets/ {
    root /var/www/frontend;
}


// ============================================================
// 8. NGINX API + FRONTEND
// ============================================================

server {
    listen 80;
    server_name example.com;

    root /var/www/frontend;

    // API → Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    // Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }
}


// ============================================================
// 9. NGINX LOAD BALANCING
// ============================================================

upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend;
    }
}

// Default:
// round-robin

// Other commonly used strategies:
// least_conn
// ip_hash

upstream backend {
    least_conn;

    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}


// ============================================================
// 10. NGINX TIMEOUTS
// ============================================================

location / {
    proxy_pass http://127.0.0.1:3000;

    proxy_connect_timeout 5s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}

// 504 Gateway Timeout commonly indicates:
// Nginx waited too long for upstream.


/* ============================================================
   11. NGINX CLIENT BODY / UPLOAD SIZE
   ============================================================ */

server {
    client_max_body_size 20M;
}

// Useful for:
// - file uploads
// - image uploads
// - API payload limits

// Default limits can cause:
// 413 Request Entity Too Large


// ============================================================
// 12. NGINX SECURITY HEADERS
// ============================================================

server {
    add_header X-Content-Type-Options "nosniff" always;

    add_header X-Frame-Options "SAMEORIGIN" always;

    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}

// CSP should be configured carefully based on application needs.


// ============================================================
// 13. NGINX REDIRECT HTTP → HTTPS
// ============================================================

server {
    listen 80;
    server_name example.com www.example.com;

    return 301 https://$host$request_uri;
}


// ============================================================
// 14. NGINX HTTPS
// ============================================================

// Typical production flow:
//
// Client
//   ↓ HTTPS
// Nginx
//   ↓ HTTP/private network
// Node.js

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

// Common production option:
// Let's Encrypt + Certbot


// ============================================================
// 15. NGINX RATE LIMITING
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

// Useful for protecting APIs from excessive requests.


// ============================================================
// 16. NGINX CACHING
// ============================================================

location /assets/ {
    expires 30d;
    add_header Cache-Control "public";
}

// Proxy cache is more advanced and should be introduced only
// when caching requirements are understood.


// ============================================================
// 17. NGINX COMPRESSION
// ============================================================

http {
    gzip on;
    gzip_types
        text/plain
        text/css
        application/json
        application/javascript
        application/xml;
}


// ============================================================
// 18. NGINX LOGS
// ============================================================

// Access:
sudo tail -f /var/log/nginx/access.log

// Errors:
sudo tail -f /var/log/nginx/error.log

// Search:
sudo grep "502" /var/log/nginx/error.log

// Recent requests:
sudo tail -100 /var/log/nginx/access.log


// ============================================================
// 19. NGINX COMMON TROUBLESHOOTING
// ============================================================

// 502 Bad Gateway
//
// Check:
//
// 1. Is Node.js running?
ps aux | grep node

// 2. Is application listening?
ss -ltnp | grep 3000

// 3. Test directly:
curl http://127.0.0.1:3000

// 4. Check Nginx:
sudo nginx -t

// 5. Check logs:
sudo tail -f /var/log/nginx/error.log


// 504 Gateway Timeout
//
// Usually investigate:
// - slow backend
// - database query
// - upstream timeout
// - network problem
// - overloaded application


// 403 Forbidden
//
// Check:
// - filesystem permissions
// - Nginx user
// - root directory
// - index/try_files configuration


// 404 Not Found
//
// Check:
// - server_name
// - location
// - root
// - proxy_pass
// - application route


// ============================================================
// 20. APACHE CONFIGURATION STRUCTURE
// ============================================================

// Main:
// /etc/apache2/apache2.conf

// Ports:
// /etc/apache2/ports.conf

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
// 21. APACHE VIRTUALHOST
// ============================================================

// /etc/apache2/sites-available/myapp.conf

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
// 22. APACHE IMPORTANT COMMANDS
// ============================================================

sudo apache2ctl configtest

sudo apache2ctl -S
// Show VirtualHost configuration.

sudo apache2ctl -M
// Show loaded modules.

sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod ssl

sudo a2dismod rewrite

sudo a2ensite myapp.conf
sudo a2dissite myapp.conf

sudo systemctl reload apache2


// ============================================================
// 23. APACHE mod_rewrite
// ============================================================

<VirtualHost *:80>

    ServerName example.com

    DocumentRoot /var/www/myapp

    <Directory /var/www/myapp>
        AllowOverride All
        Require all granted
    </Directory>

</VirtualHost>


// .htaccess:

RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

RewriteRule ^ index.php [L]


// Common in PHP/Laravel-style deployments.

// Prefer server configuration over .htaccess when you control
// the server; .htaccess adds per-request configuration overhead.


// ============================================================
// 24. APACHE REVERSE PROXY → NODE.JS
// ============================================================

<VirtualHost *:80>

    ServerName api.example.com

    ProxyPreserveHost On

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

</VirtualHost>


// Enable:
sudo a2enmod proxy
sudo a2enmod proxy_http

sudo apache2ctl configtest
sudo systemctl reload apache2


// ============================================================
// 25. APACHE + PHP-FPM
// ============================================================

// Common Laravel architecture:
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


// Example concept:

<FilesMatch \.php$>
    SetHandler "proxy:unix:/run/php/php-fpm.sock|fcgi://localhost/"
</FilesMatch>

// Actual socket path depends on PHP version/distribution.


// ============================================================
// 26. APACHE DOCUMENT ROOT
// ============================================================

DocumentRoot /var/www/myapp

<Directory /var/www/myapp>
    Require all granted
</Directory>

// Laravel should normally expose:
//
// /var/www/myapp/public
//
// rather than the Laravel project root.


// ============================================================
// 27. APACHE .htaccess
// ============================================================

// Common Laravel-style .htaccess:

<IfModule mod_rewrite.c>

    RewriteEngine On

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f

    RewriteRule ^ index.php [L]

</IfModule>


// Important:
// AllowOverride must permit the required directives.


// ============================================================
// 28. APACHE SSL
// ============================================================

sudo a2enmod ssl

<VirtualHost *:443>

    ServerName example.com

    SSLEngine on

    SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem

</VirtualHost>


// HTTP → HTTPS:

<VirtualHost *:80>

    ServerName example.com

    Redirect permanent / https://example.com/

</VirtualHost>


// ============================================================
// 29. APACHE LOGS
// ============================================================

sudo tail -f /var/log/apache2/access.log

sudo tail -f /var/log/apache2/error.log

sudo grep "500" /var/log/apache2/error.log

sudo journalctl -u apache2 -f


// ============================================================
// 30. APACHE TROUBLESHOOTING
// ============================================================

// Configuration error:
sudo apache2ctl configtest

// See VirtualHosts:
sudo apache2ctl -S

// Check loaded modules:
sudo apache2ctl -M

// Check service:
sudo systemctl status apache2

// Check logs:
sudo tail -f /var/log/apache2/error.log


// ============================================================
// 31. 502 / 503 / 504
// ============================================================

// 502 Bad Gateway:
// Reverse proxy cannot communicate correctly with upstream.

// Check:
curl http://127.0.0.1:3000
ss -ltnp
systemctl status <service>
tail -f /var/log/nginx/error.log
tail -f /var/log/apache2/error.log


// 503 Service Unavailable:
// Service/upstream unavailable or overloaded.

// 504 Gateway Timeout:
// Proxy waited too long for upstream response.


// ============================================================
// 32. FILE PERMISSIONS
// ============================================================

// Inspect:
ls -la /var/www/myapp

// Ownership:
sudo chown -R www-data:www-data /var/www/myapp

// Permissions:
sudo chmod -R 755 /var/www/myapp

// IMPORTANT:
// Do NOT blindly use chmod 777 in production.

// Only grant write permission to directories that actually
// need application writes, such as uploads/storage.


/* ============================================================
   33. NGINX / APACHE USER
   ============================================================ */

// Common Linux web-server user:
// www-data

ps aux | grep nginx
ps aux | grep apache2

// Verify:
ps aux | grep www-data


// ============================================================
// 34. PORTS
// ============================================================

// Show listening ports:
sudo ss -ltnp

// Specific port:
sudo ss -ltnp | grep :80
sudo ss -ltnp | grep :443
sudo ss -ltnp | grep :3000

// Alternative:
sudo lsof -i :3000

// Test HTTP:
curl -I http://localhost

// Test HTTPS:
curl -I https://example.com


// ============================================================
// 35. FIREWALL
// ============================================================

// UFW:

sudo ufw status

sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

// IMPORTANT:
// Usually expose 80/443 publicly.
// Application ports such as 3000 should normally remain private.

// Do not expose PostgreSQL :5432 publicly unless specifically
// required and properly secured.


// ============================================================
// 36. NGINX + NODE.JS PRODUCTION ARCHITECTURE
// ============================================================

// Recommended:
//
// Internet
//    ↓
// Firewall
//    ↓
// Nginx :443
//    ↓
// Node.js :3000
//    ↓
// PostgreSQL :5432
//    ↓
// Redis :6379
//
// Only Nginx should normally be internet-facing.


// ============================================================
// 37. APACHE + LARAVEL PRODUCTION ARCHITECTURE
// ============================================================

// Internet
//    ↓
// Apache :443
//    ↓
// PHP-FPM
//    ↓
// Laravel
//    ↓
// PostgreSQL/MySQL
//
// DocumentRoot:
// /var/www/app/public


// ============================================================
// 38. NODE.JS + NGINX + SYSTEMD
// ============================================================

// /etc/systemd/system/myapp.service

[Unit]
Description=My Node.js API
After=network.target

[Service]
Type=simple

User=www-data
WorkingDirectory=/var/www/myapp

ExecStart=/usr/bin/node /var/www/myapp/dist/server.js

Restart=always
RestartSec=5

Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target


// Apply:
sudo systemctl daemon-reload

// Start:
sudo systemctl start myapp

// Enable on boot:
sudo systemctl enable myapp

// Status:
sudo systemctl status myapp

// Logs:
sudo journalctl -u myapp -f


// ============================================================
// 39. GRACEFUL RELOAD VS RESTART
// ============================================================

// Nginx:
sudo systemctl reload nginx

// Apache:
sudo systemctl reload apache2

// Reload:
// Re-read configuration without unnecessarily terminating
// existing connections.

// Restart:
// Stop and start the service.

// Always test configuration first:

sudo nginx -t
sudo apache2ctl configtest


// ============================================================
// 40. DNS / DOMAIN DEBUGGING
// ============================================================

// Check DNS:
dig example.com

// Check:
nslookup example.com

// HTTP:
curl -I https://example.com

// DNS resolves but website doesn't work:
// Check:
//
// DNS
// → firewall
// → port 443
// → Nginx/Apache
// → upstream
// → application


// ============================================================
// 41. HTTP HEADERS
// ============================================================

// Inspect:
curl -I https://example.com

// Verbose:
curl -v https://example.com

// Send custom header:
curl -H "Authorization: Bearer TOKEN" \
     https://example.com/api/users


// ============================================================
// 42. NGINX COMMON LOCATION PATTERNS
// ============================================================

// Exact:
location = /health {
    proxy_pass http://127.0.0.1:3000;
}

// Prefix:
location /api/ {
    proxy_pass http://127.0.0.1:3000;
}

// Static:
location /assets/ {
    root /var/www/frontend;
}


// ============================================================
// 43. NGINX HEALTH CHECK ENDPOINT
// ============================================================

location = /health {
    proxy_pass http://127.0.0.1:3000/health;
}

// Useful for:
// - monitoring
// - load balancers
// - deployment verification


// ============================================================
// 44. COMMON NGINX ERROR FLOW
// ============================================================

// Client receives 502:
//
// 1. Check Nginx config
sudo nginx -t

// 2. Check Nginx logs
sudo tail -f /var/log/nginx/error.log

// 3. Check Node
systemctl status myapp

// 4. Check port
ss -ltnp | grep :3000

// 5. Test upstream
curl http://127.0.0.1:3000

// 6. If direct request fails:
//    application problem.

// 7. If direct request works:
//    investigate Nginx configuration/networking.


// ============================================================
// 45. COMMON APACHE ERROR FLOW
// ============================================================

// 500:
// - configuration
// - PHP/application error
// - .htaccess
// - permissions

// Check:
sudo apache2ctl configtest
sudo apache2ctl -S
sudo tail -f /var/log/apache2/error.log


// 403:
// - filesystem permissions
// - Require rules
// - directory configuration
// - missing index

// 404:
// - DocumentRoot
// - Rewrite rules
// - application routes


// ============================================================
// 46. NGINX VS APACHE
// ============================================================

/*
NGINX:
- event-driven architecture
- excellent reverse proxy
- strong static-file performance
- commonly used as frontend proxy
- configuration generally centralized
- .htaccess not used

APACHE:
- mature ecosystem
- VirtualHost
- .htaccess
- extensive modules
- common in PHP hosting
- supports multiple MPM models
*/


// ============================================================
// 47. APACHE MPM — INTERVIEW
// ============================================================

// MPM = Multi-Processing Module.

// Common:
// prefork
// worker
// event

// prefork:
// process-oriented model.
// Historically common with older non-thread-safe PHP setups.

// worker:
// hybrid process/thread model.

// event:
// designed for efficient concurrent connections.

// Modern PHP deployments commonly use:
// Apache + event MPM + PHP-FPM


// ============================================================
// 48. NGINX WORKERS — INTERVIEW
// ============================================================

// Common concept:
//
// master process
//    ↓
// worker processes
//
// Check:
ps aux | grep nginx

// Worker processes handle connections.

// Configuration:
worker_processes auto;


// ============================================================
// 49. NGINX CONNECTIONS — INTERVIEW
// ============================================================

events {
    worker_connections 1024;
}

// Actual capacity depends on:
// - workers
// - worker_connections
// - OS limits
// - CPU
// - memory
// - network
// - workload

// Do NOT assume:
//
// RPS = worker_connections

// They represent different concepts.


// ============================================================
// 50. PERFORMANCE DEBUGGING
// ============================================================

// CPU:
top

// Memory:
free -h

// Disk:
df -h

// Directory size:
du -sh /var/log/*

// Network:
ss -s

// Processes:
ps aux --sort=-%cpu | head
ps aux --sort=-%mem | head

// Open files:
lsof

// Web server logs:
tail -f /var/log/nginx/error.log
tail -f /var/log/apache2/error.log


// ============================================================
// 51. LOG ROTATION
// ============================================================

// Production logs should not grow forever.

// Linux commonly uses logrotate.

// Check:
ls /etc/logrotate.d/

// Nginx/Apache commonly have logrotate configuration.

// Important concepts:
// - rotation
// - compression
// - retention
// - old logs


// ============================================================
// 52. SECURITY CHECKLIST
// ============================================================

// Production:
//
// [ ] HTTPS enabled
// [ ] HTTP redirects to HTTPS
// [ ] Only required ports exposed
// [ ] Application port private
// [ ] Database port private
// [ ] Correct filesystem permissions
// [ ] No secrets in configuration committed to Git
// [ ] Security headers where appropriate
// [ ] Request size limits
// [ ] Rate limiting where needed
// [ ] Logs monitored
// [ ] Services run with least privilege
// [ ] Firewall configured
// [ ] Regular updates
// [ ] Backups tested


// ============================================================
// 53. COMMON PRODUCTION MISTAKES
// ============================================================

// WRONG:
// Node.js exposed directly:
//
// Internet → :3000

// BETTER:
//
// Internet → Nginx :443 → Node.js :3000


// WRONG:
// chmod -R 777 /var/www/app

// BETTER:
// Correct owner/group and minimum required permissions.


// WRONG:
// Restart Nginx after every configuration change.

// BETTER:
sudo nginx -t
sudo systemctl reload nginx


// WRONG:
// Change timeout values without investigating the slow request.

// BETTER:
// Find the bottleneck:
// Nginx → application → database → external service.


// WRONG:
// Increase Nginx workers blindly.

// BETTER:
// Measure CPU, memory, connections, latency and throughput first.


// ============================================================
// 54. NGINX + NODE.JS REQUEST FLOW
// ============================================================

/*
Browser
   |
   | HTTPS :443
   v
Nginx
   |
   | HTTP :3000
   v
Node.js
   |
   | TCP
   v
PostgreSQL
*/

// Nginx responsibilities:
// - TLS
// - routing
// - proxying
// - static files
// - rate limiting
// - load balancing
// - request size limits

// Node.js responsibilities:
// - business logic
// - authentication
// - validation
// - database operations
// - API responses


// ============================================================
// 55. IMPORTANT HTTP STATUS CODES
// ============================================================

// 200 OK
// 201 Created
// 204 No Content

// 301 Permanent Redirect
// 302 Temporary Redirect

// 400 Bad Request
// 401 Unauthorized
// 403 Forbidden
// 404 Not Found
// 405 Method Not Allowed
// 409 Conflict
// 413 Payload Too Large
// 429 Too Many Requests

// 500 Internal Server Error
// 502 Bad Gateway
// 503 Service Unavailable
// 504 Gateway Timeout


// ============================================================
// 56. 502 VS 504 — INTERVIEW
// ============================================================

// 502:
// Proxy received an invalid/unusable response from upstream
// or could not communicate correctly with it.

// 504:
// Proxy waited for upstream but timed out.

// Typical debugging:
//
// 502:
// check application process
// check port/socket
// check upstream configuration
// check application startup/errors

// 504:
// check slow API
// check database
// check external API
// check proxy timeout
// check application load


// ============================================================
// 57. NGINX CONFIGURATION TESTING
// ============================================================

// Always:

sudo nginx -t

// Successful configuration should be followed by:

sudo systemctl reload nginx


// Apache:

sudo apache2ctl configtest

sudo systemctl reload apache2


// ============================================================
// 58. IMPORTANT FILES / PATHS
// ============================================================

/etc/nginx/nginx.conf

/etc/nginx/sites-available/
/etc/nginx/sites-enabled/

/var/log/nginx/access.log
/var/log/nginx/error.log


/etc/apache2/apache2.conf
/etc/apache2/ports.conf

/etc/apache2/sites-available/
/etc/apache2/sites-enabled/

/etc/apache2/mods-available/
/etc/apache2/mods-enabled/

/var/log/apache2/access.log
/var/log/apache2/error.log


// ============================================================
// 59. QUICK COMMAND REFERENCE — NGINX
// ============================================================

nginx -v

sudo nginx -t

sudo systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx

sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

ss -ltnp
curl -I http://localhost
curl -v https://example.com


// ============================================================
// 60. QUICK COMMAND REFERENCE — APACHE
// ============================================================

apache2 -v

sudo apache2ctl configtest
sudo apache2ctl -S
sudo apache2ctl -M

sudo systemctl status apache2
sudo systemctl start apache2
sudo systemctl stop apache2
sudo systemctl restart apache2
sudo systemctl reload apache2

sudo a2ensite myapp.conf
sudo a2dissite myapp.conf

sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl

sudo tail -f /var/log/apache2/access.log
sudo tail -f /var/log/apache2/error.log


// ============================================================
// 61. QUICK COMMAND REFERENCE — LINUX DEBUGGING
// ============================================================

ps aux

top

free -h

df -h

du -sh /path/*

ss -ltnp

lsof -i :3000

systemctl status <service>

journalctl -u <service> -f

tail -f /var/log/<file>

grep "pattern" /var/log/<file>

curl -I https://example.com

curl -v https://example.com

dig example.com

chmod
chown


// ============================================================
// 62. IMPORTANT NGINX DIRECTIVES
// ============================================================

server
listen
server_name

location
root
index
try_files

proxy_pass
proxy_set_header
proxy_http_version

upstream

return
rewrite
redirect

ssl_certificate
ssl_certificate_key

client_max_body_size

proxy_connect_timeout
proxy_send_timeout
proxy_read_timeout

limit_req_zone
limit_req

gzip
expires
add_header

access_log
error_log

worker_processes
worker_connections


// ============================================================
// 63. IMPORTANT APACHE DIRECTIVES / CONCEPTS
// ============================================================

<VirtualHost>

ServerName
ServerAlias
DocumentRoot

<Directory>
Require all granted
AllowOverride

ProxyPass
ProxyPassReverse

RewriteEngine
RewriteCond
RewriteRule

SSLEngine
SSLCertificateFile
SSLCertificateKeyFile

ErrorLog
CustomLog

// Important modules:
mod_rewrite
mod_proxy
mod_proxy_http
mod_ssl
mod_headers


// ============================================================
// 64. INTERVIEW QUICK REFERENCE
// ============================================================

/*
Q: Why use Nginx in front of Node.js?

A:
TLS termination, reverse proxying, static files, load balancing,
request limits, caching, and hiding the application server.


Q: Does Nginx replace Node.js?

A:
No.

Nginx is commonly the reverse proxy/web server.
Node.js handles application/business logic.


Q: What is a reverse proxy?

A:
A server receives client requests and forwards them to backend
servers.


Q: What causes 502?

A:
Usually an upstream communication/application problem.


Q: What causes 504?

A:
Upstream response timeout.


Q: Why not expose Node.js port 3000?

A:
Keep the application behind the reverse proxy/firewall and expose
only required public ports.


Q: What does proxy_pass do?

A:
Forwards requests to an upstream server.


Q: Why proxy_set_header Host?

A:
Preserves the original Host information for the upstream.


Q: What is an Nginx upstream?

A:
A group of backend servers used for proxying/load balancing.


Q: What is VirtualHost in Apache?

A:
Configuration allowing Apache to serve different domains/sites.


Q: What is .htaccess?

A:
Per-directory Apache configuration, commonly used when server-level
configuration access is unavailable.


Q: Nginx vs Apache?

A:
Both can serve HTTP, reverse proxy and TLS traffic. Nginx is widely
used as a high-concurrency reverse proxy/static server. Apache has
a mature module ecosystem and .htaccess/VirtualHost-based setups.


Q: What should you do before changing Nginx configuration?

A:
nginx -t


Q: What should you do before changing Apache configuration?

A:
apache2ctl configtest


Q: Reload vs restart?

A:
Reload applies configuration changes while generally preserving
existing connections. Restart fully restarts the service.


Q: How do you debug a 502?

A:
Check proxy logs → backend process → listening port/socket →
direct curl to upstream → application logs.


Q: How do you find which process owns port 3000?

A:
ss -ltnp | grep :3000
or
lsof -i :3000


Q: Why use HTTPS termination at Nginx?

A:
Centralize TLS handling while forwarding traffic to private
backend services.


Q: What is TLS termination?

A:
The reverse proxy decrypts HTTPS traffic and forwards the request
to the internal backend.


Q: Can Nginx load balance Node.js?

A:
Yes. Configure multiple upstream Node.js instances.


Q: Does adding more Nginx workers automatically increase RPS?

A:
No. Performance depends on CPU, connections, OS limits, network,
upstream performance and workload.
*/


// ============================================================
// 65. PRODUCTION CHECKLIST
// ============================================================

/*
DNS
 ↓
Firewall
 ↓
HTTPS :443
 ↓
Nginx / Apache
 ↓
Node.js / PHP-FPM
 ↓
PostgreSQL / MySQL
 ↓
Redis

Before production:

[ ] DNS configured
[ ] HTTPS configured
[ ] HTTP → HTTPS
[ ] Firewall configured
[ ] Only required ports public
[ ] Nginx/Apache config tested
[ ] Reverse proxy tested
[ ] Application runs as service
[ ] Application port private
[ ] Correct file permissions
[ ] Logs configured
[ ] Log rotation enabled
[ ] Rate limiting considered
[ ] Request-size limits configured
[ ] Monitoring configured
[ ] Database protected
[ ] Backups configured
[ ] Restore procedure tested
[ ] Graceful reload/restart tested
[ ] 502/504 troubleshooting understood
*/


// ============================================================
// 66. MOST IMPORTANT 20% TO MEMORIZE
// ============================================================

/*
NGINX:

/etc/nginx/nginx.conf
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/

/var/log/nginx/access.log
/var/log/nginx/error.log

nginx -t
systemctl reload nginx

server {}
location {}
upstream {}
proxy_pass
proxy_set_header
try_files
listen
server_name
root
return
ssl
limit_req
client_max_body_size

502 → upstream problem
504 → upstream timeout


APACHE:

/etc/apache2/apache2.conf
/etc/apache2/sites-available/
/etc/apache2/sites-enabled/

/var/log/apache2/access.log
/var/log/apache2/error.log

apache2ctl configtest
apache2ctl -S
apache2ctl -M

a2ensite
a2dissite
a2enmod
a2dismod

<VirtualHost>
DocumentRoot
ServerName
ProxyPass
ProxyPassReverse
RewriteEngine
RewriteRule
.htaccess
PHP-FPM


LINUX:

systemctl
journalctl
ps
top
free
df
du
ss
lsof
curl
grep
tail
chmod
chown
kill

Ports:
ss -ltnp

Logs:
journalctl -u service -f
tail -f logfile

CPU:
top

Memory:
free -h

Disk:
df -h

Service:
systemctl status service


PRODUCTION ARCHITECTURE:

Internet
   ↓
Nginx/Apache
   ↓
Node.js/PHP-FPM
   ↓
PostgreSQL/MySQL
   ↓
Redis

Keep backend/database ports private.

Always test configuration before reload.

Measure before tuning.

*/