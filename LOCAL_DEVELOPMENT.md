# Local Development Guide

## 🚀 Running Locally with Cloud Database

You can run your application locally while using the Neon PostgreSQL cloud database.

### Prerequisites

- Java 17+ installed
- Maven installed (or use Maven wrapper `./mvnw`)
- Node.js 18+ and npm installed

---

## 📝 Setup Instructions

### 1. Backend Setup (Spring Boot)

#### Using application-neon.properties (Recommended)

```bash
cd backend

# Run with neon profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=neon

# Or on Windows
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=neon
```

The backend will:

- Start on `http://localhost:8080`
- Connect to Neon PostgreSQL cloud database
- Use JWT authentication with HTTP-only cookies

#### Environment Variables (Optional)

If you want to override defaults, create a `.env` file:

```bash
# backend/.env
SPRING_DATASOURCE_PASSWORD=npg_RoN8Huy9qJYX
JWT_SECRET=de18b05f00c1f78b46b241b83693cb82
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

The frontend will:

- Start on `http://localhost:5173`
- Automatically connect to backend at `http://localhost:8080`
- Use cookie-based authentication

---

## 🧪 Testing Locally

### 1. Start Backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=neon
```

Wait for: `Started DsaTrackerApplication in X seconds`

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Access Application

Open browser: `http://localhost:5173`

### 4. Test Features

- ✅ Register new account
- ✅ Login
- ✅ Add questions
- ✅ View stats
- ✅ Logout

---

## 🔍 Important Notes

### Database Behavior

- Your local app uses the **same Neon database** as production
- Changes made locally will be visible in production
- Consider creating a separate dev database if needed

### Cookie Authentication

- JWT tokens are stored in HTTP-only cookies
- Cookies work automatically with `localhost`
- Username is stored in localStorage for display only

### CORS Configuration

`localhost:5173` is already configured in backend CORS settings.

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check Java version
java -version  # Should be 17+

# Check if port 8080 is in use
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows
```

### Frontend can't connect to backend

1. Verify backend is running on port 8080
2. Check browser console for errors
3. Verify `.env.development` has correct API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

### Database connection issues

1. Check internet connection
2. Verify Neon database password in `application-neon.properties`
3. Check Neon database is not paused (auto-pauses after inactivity)

### Authentication issues

1. Clear browser cookies and localStorage (F12 → Application → Clear All)
2. Check backend logs for JWT errors
3. Verify CORS origins include `http://localhost:5173`

---

## 📊 Quick Commands Reference

### Backend

```bash
# Start with neon profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=neon

# Clean and rebuild
./mvnw clean install

# Skip tests
./mvnw spring-boot:run -DskipTests
```

### Frontend

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔐 Security Notes

### Local Development

- Cookies use `Secure: false` for localhost (HTTP)
- `SameSite: Lax` for CSRF protection
- HTTP-only cookies prevent XSS attacks

### Production

- Cookies use `Secure: true` (HTTPS required)
- Same security settings apply
- Never commit secrets to Git

---

## 🎯 Next Steps

### Want a separate development database?

1. Create new Neon database
2. Update `application-neon.properties` with new connection string
3. Or create `application-local.properties`:

```properties
spring.datasource.url=jdbc:postgresql://your-dev-neon-url
spring.datasource.username=your_dev_username
spring.datasource.password=your_dev_password
```

Run with: `./mvnw spring-boot:run -Dspring-boot.run.profiles=local`

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Vite Documentation](https://vitejs.dev/)
- [Neon PostgreSQL](https://neon.tech/docs)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
