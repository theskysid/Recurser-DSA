# Deployment Troubleshooting Guide

## Common Render Deployment Errors & Solutions

### ✅ **FIXED: CORS allowCredentials Error**

**Error Message:**
```
When allowCredentials is true, allowedOrigins cannot contain the special value "*"
```

**Cause:** 
- `@CrossOrigin(origins = "*")` in controllers conflicts with `allowCredentials = true` needed for cookies

**Solution:**
- ✅ Removed `@CrossOrigin` annotations from all controllers
- ✅ CORS is configured globally in `WebSecurityConfig.java`
- ✅ Uses specific origins from `app.cors.allowed-origins` property

---

## 🔍 **How to Monitor Deployment**

### **Render Logs:**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your service
3. Click "Logs" tab
4. Watch for:
   - ✅ `Started DsaTrackerApplication` = Success
   - ❌ `Exception` or `Error` = Problem

### **Netlify Deployment:**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click on your site
3. Click "Deploys" tab
4. Check status:
   - ✅ `Published` = Live
   - ⏳ `Building` = In progress
   - ❌ `Failed` = Error

---

## 🐛 **Common Backend Issues**

### 1. **Database Connection Failure**

**Symptoms:**
```
Connection refused
Unable to connect to database
```

**Solutions:**
- ✅ Check Neon database is not paused (auto-pauses after inactivity)
- ✅ Verify `DATABASE_URL` environment variable in Render
- ✅ Check database password is correct
- ✅ Ensure SSL is enabled in connection string

**Fix:**
```bash
# Verify DATABASE_URL format
jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
```

---

### 2. **JWT Secret Missing**

**Symptoms:**
```
JWT_SECRET environment variable not found
Invalid JWT signature
```

**Solutions:**
- ✅ Set `JWT_SECRET` in Render environment variables
- ✅ Use same secret as in `application-production.properties`
- ✅ Redeploy after adding environment variable

**How to Set:**
1. Render Dashboard → Your Service
2. Environment → Add Environment Variable
3. Key: `JWT_SECRET`
4. Value: `de18b05f00c1f78b46b241b83693cb82`
5. Save Changes → Redeploy

---

### 3. **Port Binding Error**

**Symptoms:**
```
No open ports detected
Web process failed to bind to $PORT
```

**Solution:**
- ✅ Ensure `server.port=${PORT:8080}` in application.properties
- ✅ Render automatically provides PORT environment variable

---

### 4. **Build Failure**

**Symptoms:**
```
Build failed
Maven build error
```

**Solutions:**
- ✅ Check Java version matches (17+)
- ✅ Verify `pom.xml` is valid
- ✅ Run `./mvnw clean install` locally first

---

## 🌐 **Common Frontend Issues**

### 1. **API Connection Failed**

**Symptoms:**
- Login doesn't work
- "Network Error" in console
- CORS errors

**Solutions:**
- ✅ Verify `VITE_API_BASE_URL` in Netlify environment variables
- ✅ Check backend is running on Render
- ✅ Ensure CORS origins include Netlify URL

**How to Set:**
1. Netlify Dashboard → Your Site
2. Site Settings → Environment Variables
3. Add: `VITE_API_BASE_URL` = `https://your-app.onrender.com`
4. Redeploy site

---

### 2. **Blank Page After Deployment**

**Symptoms:**
- Site loads but shows blank page
- React errors in console

**Solutions:**
- ✅ Check `_redirects` file exists in `public/` folder
- ✅ Content: `/*    /index.html   200`
- ✅ Clear browser cache

---

### 3. **Cookie Not Working**

**Symptoms:**
- Login works but immediately logs out
- "Full authentication required" errors
- Cookie not visible in DevTools

**Solutions:**
- ✅ Ensure `withCredentials: true` in axios config
- ✅ Backend sets `HttpOnly` and `SameSite` correctly
- ✅ Check CORS `allowCredentials: true` in backend
- ✅ Use HTTPS in production (cookies marked `Secure`)

---

## 🔐 **Security Configuration Checklist**

### **Backend (Render):**
- ✅ `JWT_SECRET` environment variable set
- ✅ `DATABASE_URL` with SSL enabled
- ✅ `CORS_ORIGINS` includes Netlify URL
- ✅ Cookie settings: `HttpOnly=true`, `Secure=false` (for HTTP), `SameSite=Lax`

### **Frontend (Netlify):**
- ✅ `VITE_API_BASE_URL` points to Render backend
- ✅ `withCredentials: true` in API client
- ✅ `_redirects` file for SPA routing

---

## 🧪 **Testing After Deployment**

### **1. Check Backend Health:**
```bash
# Should return 200 OK
curl https://your-backend.onrender.com/actuator/health
```

### **2. Test Authentication:**
```bash
# Register new user
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'

# Login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt
```

### **3. Check Frontend:**
1. Open browser DevTools (F12)
2. Go to Application → Cookies
3. Login to app
4. Verify `jwt-token` cookie exists
5. Try adding a question
6. Refresh page - should stay logged in

---

## 📊 **Environment Variables Summary**

### **Render Backend:**
| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Neon PostgreSQL URL | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT | ✅ Yes |
| `CORS_ORIGINS` | Frontend URLs | ✅ Yes |
| `PORT` | Auto-provided by Render | ✅ Yes (Auto) |

### **Netlify Frontend:**
| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_BASE_URL` | Backend URL | ✅ Yes |

---

## 🚨 **Emergency Fixes**

### **If everything is broken:**

1. **Rollback Render Deployment:**
   - Render Dashboard → Deploys
   - Find last working deploy
   - Click "Rollback to this version"

2. **Rollback Netlify Deployment:**
   - Netlify Dashboard → Deploys
   - Find last working deploy
   - Click "Publish deploy"

3. **Clear All Cache:**
   - Render: Manual Deploy → "Clear build cache"
   - Netlify: Deploys → "Clear cache and retry"
   - Browser: F12 → Application → Clear All

4. **Verify Git:**
   ```bash
   git log --oneline -5
   git checkout <last-working-commit>
   git push origin main --force
   ```

---

## 📞 **Getting Help**

### **Check Logs:**
- Render: Dashboard → Logs (real-time)
- Netlify: Deploys → Deploy log
- Browser: F12 → Console

### **Common Log Patterns:**

**Success:**
```
Started DsaTrackerApplication in X.XXX seconds
Tomcat started on port(s): 8080
```

**Database Issue:**
```
Connection refused
Unable to obtain JDBC Connection
```

**CORS Issue:**
```
CORS policy: No 'Access-Control-Allow-Origin'
allowedOrigins cannot contain "*"
```

**Authentication Issue:**
```
JWT token is expired
Invalid JWT signature
Full authentication is required
```

---

## ✅ **Deployment Success Criteria**

Your deployment is successful when:

- ✅ Backend logs show: `Started DsaTrackerApplication`
- ✅ Frontend shows: `Published` on Netlify
- ✅ Can access frontend URL
- ✅ Can login successfully
- ✅ Can add questions
- ✅ Can refresh page without logout
- ✅ Cookie visible in browser DevTools
- ✅ Stats page works

---

## 🎯 **Next Steps After Successful Deploy**

1. Test all features thoroughly
2. Monitor error logs for first 24 hours
3. Set up monitoring/alerts (optional)
4. Document any custom configurations
5. Create backup of working environment variables

---

**Last Updated:** After cookie authentication migration
**Status:** All known issues resolved ✅
