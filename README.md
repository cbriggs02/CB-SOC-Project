# CB-SOC Project

The **CB-SOC Project** is a comprehensive Security Operations Center (SOC) application consisting of multiple services and modules. It is designed to provide secure user management, logging, and monitoring capabilities with integration into SIEM systems.

---

## Project Structure

* `SocAPI/` – Backend API built with Node.js, TypeScript, and Express. Provides user management endpoints, security logging, and Swagger documentation.

Each module has its own README.md with detailed setup and usage instructions.

---

## Features

* Modular architecture for scalability and maintainability
* Security logging with SIEM integration
* Request and service-level logging with context (IP, requestId, userId)
* User management with hashed passwords
* API documentation via Swagger
* Global error handling with custom `AppError` class

---

## Tech Stack

* **Node.js 20**
* **TypeScript 6**
* **Express**
* **TypeORM**
* **SQLite/PostgreSQL/MySQL**
* **bcrypt** for password hashing
* **Swagger/OpenAPI** for API documentation
* **AsyncLocalStorage** for request context

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/cbriggs02/CB-SOC-Project.git
```

2. Navigate to the module you want to work on, e.g., the API service:

```bash
cd SocAPI
```

3. Follow the README in that folder for setup, environment variables, and running instructions.

---

## License

MIT License © 2026 Christian Briglio
