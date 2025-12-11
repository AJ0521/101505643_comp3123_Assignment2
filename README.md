# COMP 3123 Assignment 2 - Full Stack Employee Management System

**Student ID:** 101505643
**Student Name:** Abrar Junaid Mohammed

## Project Overview

Full-stack web application for managing employees, built with React (frontend) and Node.js/Express/MongoDB (backend). Features include user authentication, employee CRUD operations, search functionality, and file upload capabilities.

## Features

- User authentication (Signup/Login) with JWT
- Employee CRUD operations (Create, Read, Update, Delete)
- Search employees by department or position
- File upload for employee profile pictures
- Input validation and error handling
- Responsive UI with Material-UI

## Technology Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Bcrypt  
**Frontend:** React, Material-UI, Axios, React Router  
**DevOps:** Docker, Docker Compose

## Getting Started

### Prerequisites
- Docker and Docker Compose (recommended) OR Node.js (v14+) and MongoDB

### Quick Start with Docker

   ```bash
# Clone repository
   git clone <repository-url>
   cd 101505643_COMP3123_Assignment2

# Start all services
   docker-compose up
   ```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Mongo Express: http://localhost:8081 (username: `admin`, password: `pass`)

### Manual Setup

#### Backend
   ```bash
   cd backend
   npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/comp3123_assignment2
# JWT_SECRET=your_jwt_secret_key_change_in_production
   npm start
   ```

#### Frontend
   ```bash
   cd frontend
   npm install
# Create .env file with:
# REACT_APP_BACKEND_URL=http://localhost:5000/api
   npm start
   ```

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Register new user
- **POST** `/api/auth/login` - Login user

### Employee (Requires Authentication)
- **GET** `/api/employees` - Get all employees
- **GET** `/api/employees/:id` - Get employee by ID
- **POST** `/api/employees` - Create employee
- **PUT** `/api/employees/:id` - Update employee
- **DELETE** `/api/employees/:id` - Delete employee
- **GET** `/api/employees/search?department=IT&position=Developer` - Search employees

**Note:** All employee endpoints require `Authorization: Bearer <token>` header.

## Usage

1. Sign up or login to create an account
2. Add employees with required fields (firstName, lastName, email, phoneNumber, department, position, salary)
3. View, edit, or delete employees from the employee list
4. Search employees by department or position

## Testing with Postman

Import `Employee_Management_API.postman_collection.json` for 6 pre-configured test cases:
1. Health Check
2. Signup
3. Login
4. Create Employee
5. Update Employee
6. Delete Employee

See `POSTMAN_QUICK_START.md` for detailed instructions.

## GitHub Repository

**Repository:** `101505643_comp3123_assignment2_reactjs`
