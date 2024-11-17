# Portfolio Management Platform Backend

## Overview
This project implements a backend for a portfolio management platform. It includes user authentication with JWT, two-factor authentication (2FA) support, and CRUD operations for managing user portfolios. The platform is built using Express.js, MongoDB with Mongoose, and incorporates security best practices. API documentation is provided using Swagger for easy access and understanding of available endpoints.

## Key Design Decisions
1. **Authentication**:
   - JWT-based authentication for session handling.
   - Tokens are stored in HTTP-only cookies for enhanced security.
   
2. **Multi-Factor Authentication (MFA)**:
   - Optional MFA using Time-Based One-Time Passwords (TOTP) with `speakeasy`.
   - MFA can be enabled or disabled per user, with OTP verification for added security.
1. **Portfolio Management**:
   - Users can create, update, delete, and fetch portfolios.
   - Each portfolio is linked to a user through the `createdBy` field to maintain ownership.

## Architecture
- **Models**:
  - `User`: Stores user information, including hashed passwords and MFA configurations.
  - `Portfolio`: Contains portfolio details such as title, description, skills, GitHub and LinkedIn links, and an optional image array.
  
- **Controllers**:
  - `AuthController`: Handles user registration, login, logout, and token-based authentication.
  - `MFAController`: Manages the enablement and disablement of MFA, as well as OTP verification.
  - `PortfolioController`: Implements CRUD operations for managing portfolios.
  
- **Middleware**:
  - `authMiddleware`: Protects routes and ensures role-based access control (RBAC).
  
- **Database**: MongoDB with Mongoose is used for schema definition and data interaction.

## Features
### Authentication
- **Registration**:
  - Allows users to register by providing their email and password, which are securely hashed.
  - Ensures unique email addresses for each user.

- **Login**:
  - Validates user credentials and supports MFA if it is enabled for the user.

- **Token Management**:
  - JWT tokens are signed with a secret and stored securely in HTTP-only cookies.
  - Provides utilities for generating and validating tokens.

- **Logout**:
  - Clears cookies to invalidate the user's session and log them out.

### Multi-Factor Authentication (MFA)
- MFA uses `speakeasy` for generating and verifying Time-Based One-Time Passwords (TOTP).
- Provides endpoints for enabling/disabling MFA and verifying OTPs for added account security.

### Portfolio Management
- **CRUD Operations**:
  - Users can perform CRUD (Create, Read, Update, Delete) operations on their portfolios.
  - Supports fetching all portfolios or filtering portfolios by user.

- **Portfolio Schema**:
  - Portfolios contain essential details such as title, description, skills, GitHub and LinkedIn links, and an optional image array for a more personalized user profile.

### Security
- JWT tokens are stored in HTTP-only cookies to mitigate XSS and CSRF risks.
- Role-based access control (RBAC) is enforced for sensitive routes, ensuring that only authorized users can perform certain actions.
- Passwords are securely hashed using bcrypt for secure storage in the database.

### API Documentation with Swagger
- Swagger is used to document the API endpoints for the platform, making it easy for developers to understand and interact with the API.
- **Swagger Setup**:
  - Swagger UI is set up to provide a user-friendly interface for exploring the API endpoints.
  - All routes, request parameters, responses, and possible error codes are documented for easy reference.
- **Accessing Swagger Documentation**:
  - The Swagger documentation is available by visiting the `/api/docs` route in the application after it is running.
  - This provides an interactive API explorer where users can test endpoints directly.

## Setup and Configuration

1. **Install Dependencies**:
   - Run the following command to install necessary dependencies:  
     ```bash
     npm install
     
     ```

2. **Set up Environment Variables**:
   - Create a `.env` file in the project root with the following variables:
     - `MONGO_URL`: MongoDB connection string (local or cloud).
     - `JWT_SECRET`: Secret key used for signing JWT tokens.
     - `JWT_COOKIE_EXPIRES_IN`: Cookie expiration duration (in days).
     - `NODE_ENV`: Set the environment (`development`, `production`).

3. **Start MongoDB**:
   - Ensure MongoDB is running locally or connect to a cloud MongoDB instance (e.g., MongoDB Atlas).

4. **Run the Server**:
   - In development mode, run the following command:
     ```bash
     npm run dev
     
     ```
   - In production mode, run the following command:
     ```bash
     npm start
     
     ```

5. **Access API Documentation**:
   - Once the server is running, open your browser and navigate to `http://localhost:3000/api/docs` to access the Swagger UI for API documentation.

---

This backend implementation provides a robust, secure, and flexible platform for managing user portfolios with advanced security features, including JWT authentication, optional multi-factor authentication, and comprehensive API documentation via Swagger.
