# TechNova Ecommerce - Modern Clothing Store

TechNova is a full-stack, professional e-commerce platform designed for clothing stores. It features a robust Java backend, a dynamic Angular frontend, and a high-performance PostgreSQL database, all secured with JWT.

---

## Key Features

### Client Interface
- Dynamic Catalog: Browse clothing with real-time data from the database.
- Category Filtering: Quickly find clothes for Men, Women, or Kids.
- Responsive Design: Fully optimized for mobile, tablet, and desktop views.

### Security & Auth
- JWT Authentication: Secure login and registration system.
- Role-Based Access (RBAC): Distinct permissions for regular customers and administrators.
- Secure Passwords: Industrial-grade encryption using BCrypt.

### Admin Dashboard (TechNova Admin)
- Inventory Management: Full CRUD (Create, Read, Update, Delete) operations for products.
- Modern Sidebar: Collapsible and interactive navigation for maximum productivity.
- Stock Control: Visual alerts for low-inventory items.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 17+, Spring Boot 3, Spring Security (JWT), Hibernate (JPA) |
| **Frontend** | Angular 18/19, RxJS, Bootstrap 5, Bootstrap Icons |
| **Database** | PostgreSQL |
| **Dev Tools** | Maven, Git, Postman/pgAdmin 4 |

---

## Installation & Setup

### 1. Database (PostgreSQL)
1. Create a database named TiendaRopaDB in your PostgreSQL instance.
2. Execute the initialization script located in /database/init_schema_pg.sql.

### 2. Backend (Spring Boot)
1. Navigate to the backend folder.
2. Configure your database credentials in src/main/resources/application.properties:
   ```properties
   spring.datasource.username=your_user
   spring.datasource.password=your_password
   ```
3. Run the application using your IDE or Maven:
   ```bash
   mvn spring-boot:run
   ```

### 3. Frontend (Angular)
1. Navigate to the frontend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the store at http://localhost:4200.

---

## Project Structure

```text
Proyecto ecommerce/
├── backend/          # Spring Boot Application
├── frontend/         # Angular Application
├── database/         # SQL Scripts & Documentation
└── README.md         # Documentation
```

---

## Contribution
This project follows SOLID principles and clean code practices. Feel free to fork and enhance it!

---
Developed by [JuanPerezma](https://github.com/jhoecornelio423-lang)
