Create a single, practical reference/cheatsheet file for {{package}}.

{{package}} may be a:
- programming language
- Node.js module
- npm package
- framework
- database
- CLI tool
- operating system/tool
- web server
- DevOps tool
- cloud service
- backend technology

Examples:
- node:fs
- express
- pg
- Redis
- TypeScript
- Linux
- Nginx
- Apache HTTP Server
- Docker
- Git
- AWS EC2

============================================================
GOAL
============================================================

I want a compact "developer cheatsheet" that I can keep beside
me while coding, developing, deploying, debugging, or preparing
for technical interviews.

Cover the most commonly used 20% of {{package}} that handles
roughly 80% of real-world usage.

Prioritize practical knowledge over exhaustive documentation.

============================================================
1. ADAPT TO THE TECHNOLOGY
============================================================

IMPORTANT:

Do NOT assume {{package}} is an npm package or programming
library.

First identify what type of technology {{package}} is and
adapt the reference accordingly.

For example:

If {{package}} is a Node.js module/library:
- installation
- imports
- APIs
- methods
- options
- usage patterns
- errors
- lifecycle

If {{package}} is a database:
- installation/setup
- connection
- users/roles
- databases
- tables/collections
- CRUD
- queries
- indexes
- transactions
- locking/concurrency
- performance
- backup/restore
- security
- troubleshooting

If {{package}} is Linux:
- filesystem
- navigation
- files/directories
- permissions
- users/groups
- processes
- services
- systemd
- networking
- ports
- SSH
- package management
- environment variables
- logs
- disk/memory/CPU
- common troubleshooting
- useful commands
- production administration

If {{package}} is Nginx:
- installation
- configuration structure
- server blocks
- locations
- reverse proxy
- static files
- headers
- SSL/TLS
- redirects
- caching
- compression
- rate limiting
- load balancing
- logs
- permissions
- upstreams
- process/service management
- testing configuration
- reload/restart
- common production configurations
- troubleshooting

If {{package}} is Apache:
- installation
- configuration structure
- VirtualHost
- DocumentRoot
- modules
- mod_rewrite
- reverse proxy
- PHP-FPM
- SSL/TLS
- headers
- logs
- permissions
- .htaccess where relevant
- service management
- configuration testing
- reload/restart
- common production configurations
- troubleshooting

If {{package}} is Docker:
- images
- containers
- Dockerfile
- build
- run
- exec
- logs
- volumes
- networks
- environment variables
- Docker Compose
- health checks
- resource limits
- cleanup
- production patterns
- troubleshooting

If {{package}} is Git:
- repository setup
- branches
- commits
- merge/rebase
- remote
- pull/push
- stash
- reset/revert
- cherry-pick
- tags
- conflict resolution
- .gitignore
- SSH
- common recovery commands
- collaboration workflows

============================================================
2. SETUP / INSTALLATION
============================================================

Start with installation/setup when applicable.

Include:

- installation commands
- required dependencies
- initialization
- basic configuration
- configuration file locations
- environment variables
- service startup

Only include setup that is actually relevant to {{package}}.

============================================================
3. CORE CONCEPTS
============================================================

Show the most important concepts that someone working with
{{package}} must understand.

Keep this practical.

Avoid lengthy theory.

Focus on concepts that frequently appear in:

- production
- debugging
- backend development
- system administration
- interviews

============================================================
4. CORE COMMANDS / API / CONFIGURATION
============================================================

Adapt this section based on {{package}}.

For libraries:

- important functions
- classes
- methods
- properties
- options
- return values

For CLI tools:

- important commands
- flags/options
- command arguments
- useful combinations

For Linux:

- commands
- important flags
- paths
- permissions
- process/service commands

For web servers:

- directives
- configuration blocks
- configuration files
- important options
- service commands

For databases:

- SQL/CLI commands
- configuration
- administration commands

============================================================
5. COMMON REAL-WORLD OPERATIONS
============================================================

Cover the operations I am most likely to perform in real work.

Adapt these to {{package}}.

Possible categories:

- basic usage
- CRUD where applicable
- configuration
- deployment
- process management
- service management
- networking
- permissions
- logging
- monitoring
- security
- performance
- backup/restore
- troubleshooting
- integration with backend applications

Do NOT force irrelevant categories into the reference.

============================================================
6. PRODUCTION USAGE
============================================================

Show the most important production patterns.

Include relevant topics such as:

- recommended configuration
- security
- permissions
- resource limits
- logging
- monitoring
- performance
- scalability
- reliability
- graceful shutdown/reload
- backup/recovery
- deployment
- environment configuration

Focus on practical decisions.

============================================================
7. ERROR HANDLING / TROUBLESHOOTING
============================================================

This section is especially important.

Show:

- common errors
- how to identify the problem
- commands/tools used to investigate
- common causes
- practical fixes

Prefer:

PROBLEM
→ CHECK
→ LIKELY CAUSE
→ FIX

Examples:

"Port 80 already in use"
→ check process
→ identify service
→ stop/reconfigure process

"502 Bad Gateway"
→ check upstream
→ check application process
→ check socket/port
→ check logs

"Permission denied"
→ inspect owner/group
→ inspect permissions
→ fix ownership/permissions

Keep troubleshooting practical.

============================================================
8. LOGS / DEBUGGING
============================================================

Show where logs are located and how to inspect them when
applicable.

Include useful commands such as:

- tail
- grep
- journalctl
- systemctl
- ps
- ss
- lsof
- top
- df
- du

ONLY include commands relevant to {{package}}.

Show practical examples.

============================================================
9. SECURITY
============================================================

Include the most important security considerations for
{{package}}.

Examples:

- authentication
- authorization
- file permissions
- secrets
- TLS/SSL
- exposed ports
- firewall
- injection
- unsafe configuration
- least privilege
- public/private access
- security headers
- sensitive logs

Do not provide generic security theory.

Focus on mistakes commonly made in real production systems.

============================================================
10. PERFORMANCE
============================================================

Cover the most important performance concepts for {{package}}.

Examples:

- bottlenecks
- CPU
- memory
- disk I/O
- network
- connection limits
- caching
- pooling
- concurrency
- worker/process configuration
- indexes
- compression
- load balancing

Show how to identify performance problems.

============================================================
11. INTEGRATION / BACKEND USAGE
============================================================

If {{package}} commonly integrates with backend applications,
show the important patterns.

Examples:

Nginx:

Client
→ Nginx
→ Node.js
→ PostgreSQL

Apache:

Client
→ Apache
→ PHP-FPM/Laravel

Linux:

Node.js
→ systemd
→ Linux
→ Nginx
→ Internet

PostgreSQL:

Node.js
→ pg Pool
→ PostgreSQL

Only include integrations relevant to {{package}}.

============================================================
12. CONFIGURATION EXAMPLES
============================================================

Prefer realistic configuration examples.

Examples:

- nginx.conf
- Apache VirtualHost
- systemd service
- Dockerfile
- docker-compose.yml
- PostgreSQL configuration
- environment variables
- shell commands

Make examples production-oriented where practical.

Clearly mark:

DEVELOPMENT
or
PRODUCTION

when the configuration differs.

============================================================
13. COMMAND / CONFIGURATION SAFETY
============================================================

For commands that can:

- delete files
- terminate processes
- modify permissions
- modify firewall rules
- restart services
- modify databases
- overwrite configuration

add a short warning comment.

Do not hide destructive commands, but clearly identify them.

============================================================
14. INTERVIEW KNOWLEDGE
============================================================

Include the most important concepts/questions that commonly
appear in backend/system-design interviews.

Examples:

Linux:
- process vs thread
- permissions
- ports
- TCP
- DNS
- systemd
- signals
- memory
- CPU
- filesystem

Nginx:
- reverse proxy
- load balancing
- upstream
- worker processes
- connection handling
- TLS termination
- 502/504 errors
- caching

Apache:
- MPM
- prefork/worker/event
- VirtualHost
- mod_rewrite
- PHP-FPM
- reverse proxy

PostgreSQL:
- indexes
- transactions
- MVCC
- isolation
- locks
- connection pooling

Node.js:
- event loop
- async I/O
- worker threads
- streams
- memory
- process lifecycle

Keep interview notes short.

============================================================
15. COMMON MISTAKES
============================================================

Include the most common mistakes developers make with
{{package}}.

Format:

// WRONG
...

// BETTER
...

or:

PROBLEM:
...

WHY:
...

BETTER:
...

============================================================
16. REAL-WORLD EXAMPLES
============================================================

Include a small number of realistic examples.

Examples should reflect actual backend development and
production environments.

Do NOT create dozens of trivial examples.

Prefer examples such as:

- deploy Node.js application
- configure Nginx reverse proxy
- configure HTTPS
- run application with systemd
- diagnose 502
- inspect CPU/memory
- troubleshoot port conflicts
- connect Node.js to PostgreSQL

Only include examples relevant to {{package}}.

============================================================
17. QUICK REFERENCE
============================================================

End with a compact QUICK REFERENCE.

Adapt the contents to {{package}}.

For libraries:

- important methods
- properties
- classes
- options
- patterns

For Linux:

- important commands
- important paths
- permissions
- process commands
- networking commands
- service commands
- log commands

For Nginx/Apache:

- important directives
- configuration files
- service commands
- configuration testing
- reload/restart
- logs
- common patterns

For databases:

- important commands
- configuration
- queries
- indexes
- transactions
- administration

============================================================
18. OUTPUT FORMAT
============================================================

Output ONLY the complete reference file in ONE code block.

Use concise section comments like:

// ============================================================
// SECTION
// ============================================================

Keep it compact enough that I can realistically use it as a
daily reference.

Do NOT write a long introduction outside the reference file.

Do NOT document the entire technology.

Prioritize the practical 20% that gives roughly 80% of the
real-world value.

Target:

- Backend development
- Node.js
- TypeScript
- PostgreSQL
- Linux
- Nginx
- Apache
- Production development
- System design
- Technical interviews
- Troubleshooting
- DevOps fundamentals

Assume I already understand basic programming.

Focus on practical knowledge rather than beginner-level
explanations.

{{package}} = linux & devops