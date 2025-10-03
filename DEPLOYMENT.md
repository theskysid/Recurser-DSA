# 🚀 Deployment Checklist

## Pre-Deployment Setup

### 1. Neon PostgreSQL Database
- [ ] Create Neon account at https://neon.tech
- [ ] Create new database
- [ ] Copy connection string (format: `postgresql://user:pass@host:5432/db?sslmode=require`)

### 2. GitHub Repository
- [ ] Push latest code to GitHub
- [ ] Ensure repository is accessible for deployment

## Backend Deployment (Render)

### 1. Create Render Account
- [ ] Sign up at https://render.com
- [ ] Connect GitHub account

### 2. Create Web Service
- [ ] New → Web Service
- [ ] Connect repository: `Recurser-DSA`
- [ ] Configure settings:
  ```
  Name: dsa-tracker-backend
  Runtime: Docker
  Build Command: ./render-build.sh
  Start Command: java -jar backend/target/dsa-tracker-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=production
  ```

### 3. Environment Variables
```bash
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
SPRING_PROFILES_ACTIVE=production
PORT=8080
```

### 4. Deploy & Test
- [ ] Deploy service
- [ ] Wait for build completion
- [ ] Test health endpoint: `https://your-backend.onrender.com/actuator/health`
- [ ] Note backend URL for frontend configuration

## Frontend Deployment (Vercel)

### 1. Create Vercel Account
- [ ] Sign up at https://vercel.com
- [ ] Connect GitHub account

### 2. Import Project
- [ ] New Project → Import from GitHub
- [ ] Select repository: `Recurser-DSA`
- [ ] Set root directory: `frontend`

### 3. Build Configuration
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4. Environment Variables
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com
```

### 5. Deploy & Test
- [ ] Deploy project
- [ ] Wait for build completion
- [ ] Test frontend: `https://your-app.vercel.app`
- [ ] Note frontend URL for CORS configuration

## Post-Deployment Configuration

### 1. Update CORS
- [ ] Go to Render dashboard
- [ ] Update `CORS_ORIGINS` to include Vercel URL:
  ```
  CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000,http://localhost:5173
  ```
- [ ] Redeploy backend service

### 2. Final Testing
- [ ] Visit frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test adding questions
- [ ] Test revision system
- [ ] Test statistics page
- [ ] Test API endpoints directly

## Troubleshooting Checklist

### CORS Issues
- [ ] Verify frontend URL in CORS_ORIGINS
- [ ] Redeploy backend after CORS changes
- [ ] Check browser console for CORS errors

### Database Issues
- [ ] Verify Neon connection string format
- [ ] Check database accessibility
- [ ] Review backend logs in Render

### Build Issues
- [ ] Check Render build logs
- [ ] Verify all environment variables are set
- [ ] Ensure Maven wrapper is executable

### API Connection Issues
- [ ] Verify VITE_API_BASE_URL is correct
- [ ] Check network tab in browser dev tools
- [ ] Test backend health endpoint directly

## URLs to Save
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: Neon dashboard URL
- **GitHub**: https://github.com/theskysid/Recurser-DSA

## Monitoring
- [ ] Set up Render monitoring/alerts
- [ ] Bookmark health check URL
- [ ] Monitor application performance
- [ ] Check logs regularly during initial deployment