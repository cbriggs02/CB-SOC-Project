# CB-SOC Project

A lightweight **REST API** built with **Node.js** and **TypeScript** for basic user management, with **Swagger-documented endpoints** and an **internal logging system**. The API runs in a **Linux VM** and leverages **Infrastructure as Code (IaC)** for deploying supporting components including **WAF, SIEM, database, and API**.  

This project emphasizes **observability, security, and compliance**, demonstrating integration of backend development with cybersecurity monitoring tools in a **modular, containerized environment**.  

---

## Project Structure

* `SocAPI/` – Backend API built with Node.js, TypeScript, and Express. Provides user management endpoints, security logging, and Swagger documentation.  

Each module has its own `README.md` with detailed setup and usage instructions.  

---

## Features

**Security & Observability**  
- Security logging with SIEM integration  
- Request-level logging with context (IP, requestId, userId)  
- User management with **hashed passwords**  
- Global error handling via custom `AppError` class  

**Architecture & Dev Practices**  
- **Modular, object-oriented design** for scalability and maintainability  
- API documentation via **Swagger/OpenAPI**  
- Structured for unit/integration testing and observability  

---

## Tech Stack

* **Node.js 20**  
* **TypeScript 6**  
* **Express**  
* **TypeORM**  
* **SQL Server**  
* **bcrypt** for password hashing  
* **Swagger/OpenAPI** for API documentation  
* **AsyncLocalStorage** for request context  
* **Linux VM** with Infrastructure as Code (IaC) for WAF, SIEM, database, and API  

---

## Getting Started

1. Clone the repository:


git clone https://github.com/cbriggs02/CB-SOC-Project.git


2. Navigate to the module you want to work on, e.g., the API service:


cd SocAPI


3. Follow the README in that folder for setup, environment variables, and running instructions.  

---

## Coming Soon

* WAF integration with logging to SIEM  
* Advanced SIEM analytics and alerts  
* Containerized deployment for all components using IaC templates  

---

## License

MIT License © 2026 Christian Briglio
