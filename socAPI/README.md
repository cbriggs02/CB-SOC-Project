# SOC API

**SOC API** is a security-focused backend API built with Node.js, TypeScript, and Express. It provides user management endpoints, security logging, and integration with SIEM systems for monitoring and auditing.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Database](#database)
* [Running the Application](#running-the-application)
* [API Documentation](#api-documentation)
* [Logging & Security](#logging--security)
* [Error Handling](#error-handling)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* User management (create, read, delete users)
* Password hashing with bcrypt
* Security logging via `SecurityLoggerService`
* Request-level logging middleware (HTTP method, URL, status, duration)
* AsyncLocalStorage for request context (IP, requestId, userId)
* Global error handling
* Swagger/OpenAPI documentation
* Ready for SIEM integration

---

## Tech Stack

* **Node.js 20**
* **TypeScript 6**
* **Express**
* **TypeORM**
* **SQL Server** (via TypeORM, configurable)
* **bcrypt** (for password hashing)
* **class-validator & class-transformer** (DTO validation)
* **Swagger** (API docs)

---

## Getting Started

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
PORT=3000
DB_HOST=(database_host)
DB_USER=(database_user)
DB_PASSWORD=(database_password)
DB_DATABASE=(database_name)
DB_ENCRYPT=true
DB_TRUST_CERT=true
```

> Adjust the database configuration depending on your DB type (PostgreSQL, MySQL, etc.).

---

## Database

TypeORM is used for database access. Entities are located in `src/models`.

* Initialize the database (if using SQLite, the file will be created automatically).
* Run migrations if configured:

```bash
npm run typeorm migration:run
```

---

## Running the Application

### Development

```bash
npm run dev
```

* Uses `ts-node` to run TypeScript directly.
* Watches for file changes.

### Production

```bash
npm run build
npm start
```

* Compiles TypeScript to `dist/`
* Starts Node server from compiled JS.

---

## API Documentation

Swagger docs are available at:

```text
GET /api-docs
```

* Provides details on endpoints, request/response schemas, and examples.

---

## Logging & Security

* All service-level actions are logged via `SecurityLoggerService` (e.g., user creation, deletion).
* Request-level logging middleware captures: HTTP method, URL, status code, and response time.
* Logs can be sent to a SIEM system.
* AsyncLocalStorage provides `requestId`, `IP`, and `userId` context for each log.

---

## Error Handling

* Global error handler ensures consistent HTTP responses.
* Custom `AppError` class used for service-level errors.
* Example:

```ts
throw new AppError("User not found", 404);
```

* Middleware automatically converts errors to JSON responses.

---

## License

MIT License © 2026 Christian Briglio
