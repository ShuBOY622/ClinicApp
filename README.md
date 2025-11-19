# Clinic Management System

A professional, full-stack Clinic Management System built with Spring Boot (Backend) and React (Frontend).

## Features

- **Patient Management**: Create, update, search, and view patient records.
- **Medicine Master**: Manage medicine inventory, stock, and pricing.
- **Prescription System**: Create digital prescriptions with medicine autocomplete.
- **Medical Forms**: Diet Plans, Patient Intake, Consent Forms.
- **Follow-up System**: Schedule and track patient follow-ups.
- **Document Management**: Upload and manage patient documents and reports.
- **Dashboard**: Overview of clinic statistics.

## Tech Stack

### Backend
- **Java 17** (Required)
- **Spring Boot 3.4.0**
- **Spring Data JPA** (Hibernate)
- **MySQL** (Database)
- **Lombok**
- **Spring Security**
- **SpringDoc OpenAPI** (Swagger UI)

### Frontend
- **React 18** (Vite)
- **Tailwind CSS**
- **React Router DOM**
- **Axios**
- **React Hook Form**
- **React Icons**

## Prerequisites

1.  **Java 17**: Ensure Java 17 is installed and `JAVA_HOME` is set.
    - *Note*: If you have a newer Java version (e.g., 21 or 24), you may need to explicitly set `JAVA_HOME` to your Java 17 installation when running the backend.
2.  **Node.js & npm**: For running the frontend.
3.  **MySQL**: A running MySQL server.

## Setup Instructions

### 1. Database Setup

Create a MySQL database named `clinic_db`. The application will automatically create the tables.

```sql
CREATE DATABASE clinic_db;
```

Update `backend/src/main/resources/application.properties` with your database credentials if they differ from the default:

```properties
spring.datasource.username=root
spring.datasource.password=password
```

### 2. Backend Setup

Navigate to the `backend` directory and run the application:

```bash
cd backend
# IMPORTANT: Use this command to ensure Java 17 is used
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
mvn clean install
mvn spring-boot:run
```

The backend API will start at `http://localhost:8080`.
Swagger UI documentation is available at `http://localhost:8080/swagger-ui/index.html`.

### 3. Frontend Setup

Navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start at `http://localhost:5173`.

## Usage

1.  Open `http://localhost:5173` in your browser.
2.  Login with any username/password (Authentication is currently in demo mode).
3.  Navigate through the sidebar to manage Patients, Medicines, Prescriptions, etc.

## Project Structure

```
ClinicApp/
├── backend/            # Spring Boot Application
│   ├── src/main/java   # Java Source Code
│   └── src/main/resources # Configuration & Properties
└── frontend/           # React Application
    ├── src/components  # Reusable UI Components
    ├── src/pages       # Application Pages
    └── src/services    # API Integration Services
```
