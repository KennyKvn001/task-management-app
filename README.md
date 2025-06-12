# Task Management Application

A full-stack task management application built with Quarkus and React. This application provides functionality for users to create, assign, and track tasks.

## Technologies Used

### Backend
- **Quarkus** - A Kubernetes-native Java framework
- **PostgreSQL** - Database
- **Hibernate ORM with Panache** - ORM framework
- **Quarkus RESTEasy** - REST API implementation
- **Quarkus REST Client** - For external API integration
- **JWT Authentication** - Secure authentication
- **Quarkus Quartz** - Cron jobs cynchronization

### Frontend
- **React** with TypeScript
- **Quinoa** - Integration between Quarkus and frontend
- **pnpm** - Package manager

## Prerequisites

- JDK 17 or later
- Maven 3.6.x or later
- PostgreSQL
- Node.js and pnpm (for frontend development)

## Setup and Installation

### Database Setup
1. Make sure PostgreSQL is installed and running
2. Create a database for the application (default configuration uses username: postgres, password: postgres)

### Generate JWT Keys (for Jwt authentication setup)
The application uses JWT for authentication. If you need to generate new keys:

```shell script
./generate_jwt_keys.sh
```

### Environment Variables
Set the following environment variables for JWT configuration:
- `PUBLICKEY_LOCATION` - Path to public key (default: src/main/resources/keys/publicKey.pem)
- `VERIFY_ISSUER` - JWT issuer to verify(project name)
- `SIGN_KEY_LOCATION` - Path to private key (default: src/main/resources/keys/privateKey.pem)

## Running the Application

### Development Mode

1. Start the application in development mode:

```shell script
mvn quarkus:dev
```

This will start both the backend and frontend services together due to Quinoa integration.

2. Access the application:
   - Frontend UI: http://localhost:8080/quinoa
   - Swagger UI/API docs: http://localhost:8080/q/swagger-ui

### Production Mode

1. Package the application:

```shell script
mvn package
```

2. Run the jar file:

```shell script
java -jar target/task-management-app-dev.jar
```

## API Endpoints

### Authentication Endpoints
- `POST /auth/register` - Register a new user
  - Request body: `{ "username": "string", "email": "string", "password": "string" }`
- `POST /auth/login` - Login and receive JWT token
  - Request body: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "JWT token", "username": "string", "role": "string" }`

### Task Management Endpoints
- `GET /tasks` - Get all tasks
- `GET /tasks/{id}` - Get a specific task by ID
- `POST /tasks/new` - Create a new task
  - Request body: `{ "title": "string", "description": "string", "dueDate": "string", "assignedUserIds": [number] }`
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `POST /tasks/{id}/complete` - Mark a task as complete

## Features

1. **User Authentication**
   - Registration and login
   - JWT-based authentication
   - Role-based access control

2. **Task Management**
   - Create, read, update, delete tasks
   - Assign tasks to multiple users
   - Track task completion
   - View tasks by due date

3. **External User Synchronization**
   - Automatic synchronization with external user data from JSONPlaceholder API
   - REST Client integration with https://jsonplaceholder.typicode.com/users
   - Scheduled jobs for periodic data updates
   - Merging of user data

4. **Dashboard**
   - View tasks created by the user
   - View tasks assigned to the user
   - View upcoming tasks

## Project Structure

- `src/main/java/org/example` - Backend code
  - `api` - API clients
    - `UserApiClient` - REST client for JSONPlaceholder integration
    - `dtos` - Data transfer objects for external API
  - `auth` - Authentication services and DTOs
  - `entities` - JPA entities
  - `mapper` - Object mappers
  - `repository` - Data repositories
  - `resources` - REST API endpoints
  - `services` - Business logic
  - `task` - Task-related components
- `frontend/src` - Frontend code
  - `components` - React components
  - `context` - React context providers
  - `routes` - Application routing
  - `services` - API services
  - `theme` - CSS styles
  - `views` - Page components


## Contributors

 Made with ❤️ by Kenny Kevin
