# COMP 3123 Assignment 2 - Full Stack Employee Management System

**Student ID:** 101523555

## Project Overview

This is a full-stack web application for managing employees, built with React (frontend) and Node.js/Express/MongoDB (backend). The application provides user authentication, employee CRUD operations, search functionality, and file upload capabilities.

## Project Structure

```
101523555_COMP3123_Assignment2/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service files
│   │   ├── context/       # Context API for state management
│   │   └── App.js         # Main app with routing
│   ├── Dockerfile
│   └── package.json
├── backend/               # Node.js/Express backend API
│   ├── src/
│   │   ├── models/        # MongoDB models (User, Employee)
│   │   ├── routes/        # API routes (auth, employees)
│   │   ├── middleware/    # Auth and upload middleware
│   │   └── index.js       # Server entry point
│   ├── uploads/           # Profile picture uploads
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Docker orchestration
└── Instructions/          # Assignment instructions
```

## Features

### Backend (Node.js/Express/MongoDB)
- ✅ User authentication (Signup/Login) with JWT
- ✅ Employee CRUD operations (Create, Read, Update, Delete)
- ✅ Search employees by department or position
- ✅ File upload for employee profile pictures
- ✅ Input validation and error handling
- ✅ RESTful API design
- ✅ Password hashing with bcrypt

### Frontend (React)
- ✅ User authentication (Login/Signup) with form validation
- ✅ Employee List screen with professional table display
- ✅ Add Employee form with file upload
- ✅ View Employee details screen
- ✅ Edit Employee information with validation
- ✅ Delete Employee functionality
- ✅ Search employees by department/position
- ✅ Session management using localStorage and Context API
- ✅ Responsive UI with Material-UI
- ✅ Professional design and UX
- ✅ Logout functionality

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client
- **Context API** - State management

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Mongo Express** - Database UI

## Getting Started

### Prerequisites
- Docker and Docker Compose installed (recommended)
- OR Node.js (v14+) and MongoDB installed locally

### Quick Start with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd 101523555_COMP3123_Assignment2
   ```

2. **Start all services:**
   ```bash
   docker-compose up
   ```

3. **Access the application:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:5000/api
   - **Mongo Express:** http://localhost:8081 (username: `admin`, password: `pass`)

4. **Stop services:**
   ```bash
   docker-compose down
   ```

### Manual Setup (Without Docker)

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the backend directory:**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/comp3123_assignment2
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```

4. **Start MongoDB** (if not already running):
   ```bash
   # Make sure MongoDB is running on localhost:27017
   # On Windows: Start MongoDB service
   # On Mac/Linux: mongod
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the frontend directory:**
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at http://localhost:3000

## First Steps After Setup

1. Open http://localhost:3000 in your browser
2. Click **"Sign Up"** to create a new account
   - Enter username, email, and password
   - Minimum password length: 6 characters
3. After successful signup, you'll be automatically logged in and redirected to the Employee List
4. Click **"Add Employee"** to add your first employee
   - Fill in all required fields
   - Optionally upload a profile picture
5. Use the **Search** feature to find employees by department or position

## API Endpoints

### Authentication Endpoints

#### Sign Up
- **POST** `/api/auth/signup`
- **Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "testuser",
      "email": "test@example.com"
    }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "testuser",
      "email": "test@example.com"
    }
  }
  ```

### Employee Endpoints

All employee endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Employees
- **GET** `/api/employees`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of employee objects

#### Get Employee by ID
- **GET** `/api/employees/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Single employee object

#### Create Employee
- **POST** `/api/employees`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Body (Form Data):**
  - `firstName` (string, required)
  - `lastName` (string, required)
  - `email` (string, required, unique)
  - `phoneNumber` (string, required)
  - `department` (string, required)
  - `position` (string, required)
  - `salary` (number, required)
  - `dateOfJoining` (date, optional)
  - `profilePicture` (file, optional, max 5MB)

#### Update Employee
- **PUT** `/api/employees/:id`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Body:** Same as Create Employee

#### Delete Employee
- **DELETE** `/api/employees/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "message": "Employee deleted successfully"
  }
  ```

#### Search Employees
- **GET** `/api/employees/search?department=IT&position=Developer`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `department` (string, optional) - Case-insensitive search
  - `position` (string, optional) - Case-insensitive search
  - At least one parameter is required
- **Response:** Array of matching employee objects

## Usage Guide

### User Authentication
1. **Sign Up:** Create a new account with a unique username and email
2. **Login:** Sign in with your email and password
3. **Session:** Your session is stored in localStorage and persists across page refreshes
4. **Logout:** Click the logout button to end your session

### Employee Management

#### Viewing Employees
- The Employee List screen displays all employees in a table format
- Shows profile picture, name, email, phone, department, position, and salary
- Click the **View** icon to see detailed information

#### Adding Employees
1. Click **"Add Employee"** button
2. Fill in all required fields:
   - First Name, Last Name
   - Email (must be unique)
   - Phone Number
   - Department (select from dropdown)
   - Position (select from dropdown)
   - Salary (must be a positive number)
3. Optionally upload a profile picture (max 5MB)
4. Click **"Add Employee"** to save

#### Editing Employees
1. Click the **Edit** icon next to an employee
2. Modify any fields as needed
3. Optionally upload a new profile picture
4. Click **"Update Employee"** to save changes

#### Deleting Employees
1. Click the **Delete** icon next to an employee
2. Confirm the deletion in the popup dialog
3. The employee will be permanently removed

#### Searching Employees
1. Click **"Search"** in the navigation bar
2. Select a department and/or position from the dropdowns
3. Click **"Search"** to find matching employees
4. Results are displayed in a table format
5. Click **"Reset"** to clear the search

## Testing the API with Postman

### Example Requests

1. **Sign Up:**
   ```
   POST http://localhost:5000/api/auth/signup
   Content-Type: application/json
   
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Get All Employees:**
   ```
   GET http://localhost:5000/api/employees
   Authorization: Bearer <token_from_login>
   ```

4. **Create Employee:**
   ```
   POST http://localhost:5000/api/employees
   Authorization: Bearer <token>
   Content-Type: multipart/form-data
   
   Form Data:
   - firstName: John
   - lastName: Doe
   - email: john.doe@example.com
   - phoneNumber: 123-456-7890
   - department: IT
   - position: Developer
   - salary: 75000
   - profilePicture: [file]
   ```

5. **Search Employees:**
   ```
   GET http://localhost:5000/api/employees/search?department=IT&position=Developer
   Authorization: Bearer <token>
   ```

## Project Structure Details

### Backend Structure
```
backend/
├── src/
│   ├── index.js              # Express server setup
│   ├── models/
│   │   ├── User.js           # User model with password hashing
│   │   └── Employee.js       # Employee model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── employees.js      # Employee CRUD routes
│   └── middleware/
│       ├── auth.js            # JWT authentication middleware
│       └── upload.js          # Multer file upload configuration
├── uploads/                   # Profile picture storage
├── Dockerfile
├── package.json
└── .gitignore
```

### Frontend Structure
```
frontend/
├── src/
│   ├── App.js                 # Main app with routing
│   ├── components/
│   │   ├── Login.js          # Login component
│   │   ├── Signup.js         # Signup component
│   │   ├── EmployeeList.js   # Employee list table
│   │   ├── AddEmployee.js    # Add employee form
│   │   ├── ViewEmployee.js    # Employee details view
│   │   ├── EditEmployee.js   # Edit employee form
│   │   ├── SearchEmployee.js # Search functionality
│   │   └── PrivateRoute.js   # Protected route wrapper
│   ├── services/
│   │   ├── api.js            # Axios configuration
│   │   ├── authService.js    # Authentication service
│   │   └── employeeService.js # Employee API service
│   └── context/
│       └── AuthContext.js    # Authentication context
├── Dockerfile
├── package.json
└── .gitignore
```

## Docker Configuration

The project includes a `docker-compose.yml` file that orchestrates:
- **Frontend:** React app on port 3000
- **Backend:** Node.js/Express API on port 5000
- **MongoDB:** Database on port 27017
- **Mongo Express:** Database UI on port 8081

### Docker Services

- **Frontend Service:**
  - Builds from `./frontend/Dockerfile`
  - Hot reload enabled with volume mounting
  - Environment variable: `REACT_APP_BACKEND_URL`

- **Backend Service:**
  - Builds from `./backend/Dockerfile`
  - Environment variables for MongoDB connection and JWT secret
  - Volume mount for uploads directory

- **MongoDB Service:**
  - Uses official MongoDB image
  - Persistent data storage with named volume

- **Mongo Express Service:**
  - Web-based MongoDB admin interface
  - Access at http://localhost:8081

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - **Solution:** Ensure MongoDB is running
   - With Docker: Check if mongodb service is up
   - Without Docker: Start MongoDB service manually

2. **Port Already in Use**
   - **Solution:** Change ports in `docker-compose.yml` or `.env` files
   - Frontend: Change `3000:3000` to another port
   - Backend: Change `5000:5000` to another port

3. **CORS Errors**
   - **Solution:** Verify `REACT_APP_BACKEND_URL` in frontend `.env` matches backend port
   - Ensure backend CORS middleware is configured

4. **File Upload Issues**
   - **Solution:** Ensure `backend/uploads` directory exists
   - Check file size (max 5MB)
   - Verify file is an image type

5. **Authentication Token Errors**
   - **Solution:** Clear localStorage and login again
   - Check JWT_SECRET in backend `.env` file

6. **Module Not Found Errors**
   - **Solution:** Run `npm install` in both frontend and backend directories
   - Delete `node_modules` and reinstall if issues persist

## Validation Rules

### User Signup/Login
- **Username:** 3-30 characters, required
- **Email:** Valid email format, required, unique
- **Password:** Minimum 6 characters, required

### Employee Fields
- **First Name:** Required, non-empty string
- **Last Name:** Required, non-empty string
- **Email:** Required, valid email format, unique
- **Phone Number:** Required, non-empty string
- **Department:** Required, must be selected from dropdown
- **Position:** Required, must be selected from dropdown
- **Salary:** Required, must be a positive number
- **Profile Picture:** Optional, max 5MB, image files only
- **Date of Joining:** Optional, defaults to current date

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Protected API routes with authentication middleware
- Input validation on both client and server
- File upload restrictions (size and type)
- CORS configuration for secure cross-origin requests

## Screenshots Required for Submission

Please include screenshots of:
1. **MongoDB Data** (1 screenshot)
   - Show collections and sample documents
2. **REST API Tests with Postman** (5-8 screenshots)
   - Signup request/response
   - Login request/response
   - Create employee request/response
   - Get employees request/response
   - Update employee request/response
   - Delete employee request/response
   - Search employees request/response
3. **Frontend CRUD Operations** (5-8 screenshots)
   - Login screen
   - Employee list
   - Add employee form
   - View employee details
   - Edit employee form
   - Delete confirmation
4. **Search Screen** (2-3 screenshots)
   - Search form
   - Search results

## GitHub Repository

**Repository Name:** `101523555_comp3123_assignment2_reactjs`

### Commit Guidelines
- Use descriptive commit messages
- Commit frequently with meaningful changes
- Include both frontend and backend in the repository
- Remove `node_modules` before committing (use .gitignore)

## Deployment Options

### Cloud Deployment
The application can be deployed to:
- **Heroku** - For backend and frontend
- **Vercel** - For frontend (React)
- **Render** - For backend and frontend
- **MongoDB Atlas** - For cloud database

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure `MONGO_URI` for cloud MongoDB
- Update `REACT_APP_BACKEND_URL` to production backend URL

## Notes

- All API endpoints require authentication except `/api/auth/signup` and `/api/auth/login`
- Profile pictures are stored in the `backend/uploads` directory
- JWT tokens are stored in browser localStorage
- The application uses Material-UI for a professional, responsive design
- All forms include both client-side and server-side validation
- The application is fully responsive and works on mobile devices
- Code is organized into modules and services for maintainability

## License

This project is created for educational purposes as part of COMP 3123 Assignment 2.

## Author

**Student ID:** 101523555  
**Course:** COMP 3123  
**Assignment:** Assignment 2 - Frontend (12%)

---

For any questions or issues, please refer to the assignment instructions in the `Instructions/` folder.
