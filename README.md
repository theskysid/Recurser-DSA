# DSA Tracker

A full-stack web application for tracking and revising Data Structures and Algorithms (DSA) questions. Built with Spring Boot backend, React frontend, and PostgreSQL database.

## Features

### Authentication

- User registration and login using JWT tokens
- Secure session management
- Protected routes for authenticated users only

### Question Management

- Add new DSA questions with number, name, topics, link, and notes
- Queue-based revision system
- Track attempt count and last revision date
- Automatic queue position management

### Analytics & Statistics

- Dashboard with question overview
- Revision statistics over time
- Topic distribution charts
- Progress tracking

## Tech Stack

### Backend

- **Java 17** with **Spring Boot 3.2**
- **Spring Web** for REST APIs
- **Spring Data JPA** for database operations
- **Spring Security** with JWT authentication
- **PostgreSQL** for production, **H2** for development
- **Maven** for dependency management

### Frontend

- **React 18** with **TypeScript**
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **Recharts** for data visualization

### Deployment

- **Docker** containers for all services
- **Docker Compose** for orchestration
- **Nginx** for frontend serving

## Project Structure

```
DSA-tracker/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/dsatracker/
│   │       ├── entity/      # JPA entities
│   │       ├── repository/  # Data repositories
│   │       ├── service/     # Business logic
│   │       ├── controller/  # REST controllers
│   │       ├── dto/         # Data transfer objects
│   │       ├── security/    # Security configuration
│   │       └── config/      # Application configuration
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-dev.properties
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── database/
│   └── init.sql            # Database initialization
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** (for containerized deployment)
- **Node.js 20+** (for local development)
- **Java 17+** (for local development)
- **Maven 3.6+** (for local development)

### Database Options

This application supports multiple database configurations:

#### 1. Neon PostgreSQL (Cloud Database - Recommended)

For production deployment with cloud database:

1. **Set up Neon PostgreSQL**

   - Create a free account at [Neon](https://neon.tech)
   - Create a database and get connection string

2. **Configure application**

   ```bash
   # The application includes application-neon.properties
   # Update with your Neon connection details if needed
   ```

3. **Run with Neon profile**

   ```bash
   # Backend only
   cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=neon

   # Frontend
   cd frontend && npm run dev
   ```

#### 2. Local PostgreSQL with Docker

1. **Start all services with local database**

   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

#### 3. Neon PostgreSQL with Docker

1. **Use Docker Compose with Neon**

   ```bash
   docker-compose -f docker-compose-neon.yml up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Local Development

#### Backend Development

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Choose your database profile**

   **Option A: H2 In-Memory Database (Development)**

   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

   - Access H2 Console: http://localhost:8080/h2-console
   - JDBC URL: jdbc:h2:mem:testdb
   - Username: sa, Password: password

   **Option B: Local PostgreSQL**

   ```bash
   ./mvnw spring-boot:run
   ```

   **Option C: Neon PostgreSQL (Cloud)**

   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=neon
   ```

#### Frontend Development

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Access application**
   - Frontend: http://localhost:5173

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Questions

- `GET /api/questions` - Get all user questions
- `POST /api/questions` - Add new question
- `POST /api/questions/{id}/revise` - Mark question as revised
- `GET /api/questions/next` - Get next question to revise
- `GET /api/questions/stats` - Get user statistics

## Database Schema

### Users Table

- `id` (Primary Key)
- `username` (Unique)
- `password` (Encrypted)
- `enabled`

### Questions Table

- `id` (Primary Key)
- `number` (Unique per user)
- `name`
- `topics` (List of strings)
- `link`
- `notes`
- `date_added`
- `attempt_count`
- `last_attempt`
- `position` (Queue position)
- `user_id` (Foreign Key)

## Environment Variables

### Backend

- `SPRING_PROFILES_ACTIVE` - Application profile (dev/default/neon)
- `SPRING_DATASOURCE_URL` - Database URL (not needed for neon profile)
- `SPRING_DATASOURCE_USERNAME` - Database username (not needed for neon profile)
- `SPRING_DATASOURCE_PASSWORD` - Database password (not needed for neon profile)

### Frontend

- `VITE_API_BASE_URL` - Backend API URL

## Configuration Files

### Database Configurations

- `application.properties` - Default configuration (local PostgreSQL)
- `application-dev.properties` - Development configuration (H2 in-memory)
- `application-neon.properties` - Neon PostgreSQL cloud database configuration

### Docker Configurations

- `docker-compose.yml` - Local PostgreSQL setup
- `docker-compose-neon.yml` - Neon PostgreSQL setup (no database container)

## Docker Configuration

### Backend Container

- Base image: `eclipse-temurin:17-jre-alpine`
- Port: 8080
- Health check: Spring Boot Actuator

### Frontend Container

- Base image: `nginx:alpine`
- Port: 80 (mapped to 3000)
- Serves built React application

### Database Container

- Base image: `postgres:15-alpine`
- Port: 5432
- Persistent volume for data

## Development Workflow

1. **Create a new user account**
2. **Add DSA questions** with topics and links
3. **Use "Revise Next"** to practice questions in queue order
4. **Track progress** through statistics and analytics
5. **Questions automatically move to end** of queue after revision

## Queue System

The application implements a queue-based revision system:

- Questions are ordered by `position` field
- "Revise Next" gets the question with lowest position
- After revision, question moves to end (highest position)
- Tracks attempt count and last revision timestamp

## Security Features

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration for frontend
- Protected API endpoints
- SQL injection prevention via JPA

## Future Enhancements

- [ ] Question difficulty levels
- [ ] Spaced repetition algorithm
- [ ] Study streaks and goals
- [ ] Question categories and filtering
- [ ] Social features and sharing
- [ ] Mobile responsive improvements
- [ ] Bulk question import
- [ ] Progress export functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
