```md
# OSP Web App (CPS630)

**Luxe Haven** — an e-commerce demo built with **React (Vite)** + **PHP** + **MySQL**.

> **Recommended setup:** **XAMPP (Apache + MySQL)**.  
> This project was originally created and tested with XAMPP.  
> A no-Apache local option using PHP’s built-in server is also included.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [1) Database Setup](#1-database-setup)
- [2) XAMPP / Apache (RECOMMENDED)](#2-xampp--apache-recommended)
- [3) Local Dev Without Apache (PHP built-in server)](#3-local-dev-without-apache-php-built-in-server)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [One-Command Runner (optional)](#one-command-runner-optional)
- [Notes](#notes)

---

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** PHP (endpoints under `backend/api`)
- **Database:** MySQL
- **Dev Tools:** XAMPP (Apache + MySQL) or PHP built-in server

---

## Prerequisites
- **PHP 8+**
- **Node 16+** (or newer)
- **MySQL** (via XAMPP or a local install)
- **XAMPP** (if you use the recommended Apache route)

---

## Project Structure
```

.
├─ backend/
│  └─ api/                 # PHP endpoints (login.php, signup.php, etc.)
├─ my-app/                 # React (Vite) frontend
│  └─ src/...
└─ db/
└─ osp.sql              # Database dump (schema + seed data)

````

---

## 1) Database Setup

Create a database named **`osp`** and import the dump.

**phpMyAdmin**
1. Open phpMyAdmin (e.g., `http://localhost/phpmyadmin`).
2. Create database **`osp`** (utf8mb4).
3. Go to **Import** → choose `db/osp.sql` → **Go**.

**CLI**
```bash
mysql -u root -p -e 'DROP DATABASE IF EXISTS osp; CREATE DATABASE osp;'
mysql -u root -p osp < db/osp.sql
````

---

## 2) XAMPP / Apache (RECOMMENDED)

This is the canonical way the project was built and tested.

1. **Place the project under XAMPP htdocs**

   ```
   /Applications/XAMPP/xamppfiles/htdocs/osp
   ```

2. **Backend DB & CORS config**
   Make sure each file in `backend/api/*.php` has this near the top (before any output):

   ```php
   // --- DB ---
   $servername = "localhost";
   $username   = "root";
   $password   = "";
   $dbname     = "osp";

   // --- CORS for Vite (port 5173 by default) ---
   header("Access-Control-Allow-Origin: http://localhost:5173");
   header("Access-Control-Allow-Credentials: true");
   header("Access-Control-Allow-Headers: Content-Type, Authorization");
   header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
   if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
   ```

3. **Start Apache + MySQL** in XAMPP.

4. **Frontend config** → create `my-app/.env.local`:

   ```
   VITE_API_BASE=http://localhost/osp/backend/api
   ```

5. **Run the frontend**

   ```bash
   cd my-app
   npm install
   npm run dev
   ```

6. **Open the app:** [http://localhost:5173](http://localhost:5173) → go to **/signup**, then **/login**.

**Apache 403 fix (if needed)**
In `/Applications/XAMPP/xamppfiles/etc/httpd.conf`, either comment out vhosts:

```apache
# Include etc/extra/httpd-vhosts.conf
```

or explicitly allow your project directory:

```apache
<Directory "/Applications/XAMPP/xamppfiles/htdocs/osp">
  Options Indexes FollowSymLinks
  AllowOverride All
  Require all granted
</Directory>
```

Restart Apache after changes.

---

## 3) Local Dev Without Apache (PHP built-in server)

Use this if you want to run outside `htdocs` (e.g., `~/Coding/OSP-WebApp-CPS630`).

**You will need two terminal windows/tabs:**
  - One for the backend
  - One for the frontend

1. **Run the backend** (first terminal):
   ```bash
   cd backend
   php -S localhost:8081 -t .
   ```

   API base is now **[http://localhost:8081/api](http://localhost:8081/api)**

2. **Frontend config**
   - Copy `my-app/.env.example` to `my-app/.env.local`:
     ```bash
     cp my-app/.env.example my-app/.env.local
     ```
   - Edit `VITE_API_BASE` in `.env.local` if needed.

   ```
   VITE_API_BASE=http://localhost:8081/api
   ```

3. **Run the frontend** (second terminal):
   ```bash
   cd my-app
   npm install
   npm run dev
   ```

4. **Open the app:** [http://localhost:5173](http://localhost:5173) → **/signup**

> If you change ports, update both `.env.local` and the PHP CORS origin.

---

## .env.example

The file `my-app/.env.example` is included as a template for environment variables. Copy it to `.env.local` and update the values as needed. This keeps sensitive or environment-specific settings out of version control and makes setup easier for new users.

---

## Common Tasks

### Create an account quickly (API)

```bash
# PHP built-in server route:
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"Secret123!","phone":"5551112222","address":"123 Main St","city_code":"TOR"}' \
  http://localhost:8081/api/signup.php

# XAMPP/Apache route:
# curl -X POST -H "Content-Type: application/json" \
#   -d '{"name":"Demo User","email":"demo@example.com","password":"Secret123!","phone":"5551112222","address":"123 Main St","city_code":"TOR"}' \
#   http://localhost/osp/backend/api/signup.php
```

### Verify the API is reachable

* `http://localhost:8081/api/login.php` (PHP built-in)
* `http://localhost/osp/backend/api/login.php` (Apache)
  A GET request may return “Method not allowed” — that means the endpoint is up.

---

## Troubleshooting

**CORS errors**

* The `Access-Control-Allow-Origin` value in PHP must **exactly** match your Vite URL (e.g., `http://localhost:5173`).
* After editing `.env.local`, **restart** `npm run dev`.

**Port already in use**

* Run backend on another port:

  ```bash
  php -S localhost:8090 -t .
  ```

  Update `VITE_API_BASE=http://localhost:8090/api` and the PHP CORS origin accordingly.

**npm EACCES / permissions on macOS**

```bash
sudo chown -R "$USER":staff my-app
sudo chmod -R u+rwX my-app
rm -rf my-app/node_modules package-lock.json
npm install
```

**Deleting a user fails (foreign keys)**

* Delete child rows first (`shopping_cart`, `orders`, `trip`, etc.), or add cascades:

```sql
ALTER TABLE shopping_cart
  DROP FOREIGN KEY shopping_cart_ibfk_1,
  ADD CONSTRAINT shopping_cart_ibfk_1
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
-- repeat for other child tables if needed
```

**“Not Found” at `http://localhost:8081/`**

* Normal with PHP built-in server if there’s no `index.php` in `/backend`. Access endpoints under `/api/...`.

---

## One-Command Runner (optional)

Create `scripts/dev.sh` to run both servers at once:

```bash
#!/usr/bin/env bash
set -euo pipefail
( cd "$(dirname "$0")/../backend" && php -S localhost:8081 -t . ) & PHP_PID=$!
( cd "$(dirname "$0")/../my-app" && npm install && npm run dev ) & VITE_PID=$!
trap 'kill $PHP_PID $VITE_PID 2>/dev/null || true' INT TERM
wait
```

Make it executable and run:

```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

---

## Notes

* Passwords are stored with **bcrypt** — use **/signup** or the API to create accounts.
* Don’t commit local secrets or build artifacts:

  * `my-app/.env.local`
  * `my-app/node_modules/`
  * `.DS_Store`
* If you rely on XAMPP, keep using it — it’s the **recommended** path for this project.

````
