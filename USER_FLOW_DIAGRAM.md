# DSA Tracker - Complete User Flow

## 🎯 Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          NEW USER JOURNEY                                │
└─────────────────────────────────────────────────────────────────────────┘

Step 1: Initial Visit
┌──────────────┐
│ User visits  │
│     /        │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Home Component       │
│ - Checks auth state  │
│ - Loading: true      │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────────┐
│ AuthContext Initialization  │
│ - No cookie found           │
│ - No username in storage    │
│ - Sets: authenticated=false │
│ - No API calls made ✅      │
└──────┬──────────────────────┘
       │
       ▼
┌──────────────────┐
│ Redirect to      │
│    /login        │ ← Clean URL, no "session expired" ✅
└──────────────────┘


Step 2: Registration
┌──────────────┐
│ Click        │
│  "Sign up"   │
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│  /register Page        │
│  - Username field      │
│  - Password field      │
│  - Confirm password    │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Fill form & Submit     │
│ POST /api/auth/register│
└──────┬─────────────────┘
       │
       ├─── Success ───────────────────┐
       │                               │
       ▼                               ▼
┌──────────────────┐         ┌─────────────────┐
│ Show success msg │         │ Backend creates │
│ Wait 2 seconds   │         │ new user in DB  │
└──────┬───────────┘         └─────────────────┘
       │
       ▼
┌──────────────────┐
│ Auto redirect to │
│     /login       │
└──────────────────┘


Step 3: Login
┌────────────────────────┐
│  /login Page           │
│  - Enter username      │
│  - Enter password      │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ Submit Login                   │
│ POST /api/auth/login           │
└──────┬─────────────────────────┘
       │
       ├─── Success ─────────────────────┐
       │                                  │
       ▼                                  ▼
┌──────────────────────────┐    ┌─────────────────────────────┐
│ Backend Response         │    │ Backend Actions             │
│ - token: "eyJ..."        │    │ 1. Validate credentials     │
│ - username: "testuser"   │    │ 2. Generate JWT token       │
└──────┬───────────────────┘    │ 3. Create HTTP-only cookie  │
       │                         │    - Name: jwt-token        │
       │                         │    - HttpOnly: true         │
       │                         │    - SameSite: Lax          │
       │                         │    - MaxAge: 86400          │
       │                         │ 4. Send cookie in response  │
       │                         └─────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Frontend Actions             │
│ 1. Receive response          │
│ 2. Cookie auto-stored by     │
│    browser ✅                │
│ 3. Store username in         │
│    localStorage              │
│ 4. Update AuthContext:       │
│    - isAuthenticated = true  │
│    - username = "testuser"   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────┐
│ Navigate to      │
│   /dashboard     │
└──────────────────┘


Step 4: Dashboard (Protected Route)
┌────────────────────────────────┐
│ Dashboard Component            │
│ - useEffect() triggers         │
│ - loadQuestions() called       │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ GET /api/questions             │
│ Cookie sent automatically ✅   │
└──────┬─────────────────────────┘
       │
       ├─── Success ────────────────────┐
       │                                │
       ▼                                ▼
┌──────────────────┐        ┌──────────────────────────┐
│ Backend          │        │ Backend validates cookie │
│ Returns []       │        │ - Extracts JWT           │
│ (empty array)    │        │ - Verifies signature     │
└──────┬───────────┘        │ - Checks expiration      │
       │                    │ - Gets username from JWT │
       │                    │ - Queries user's questions│
       │                    └──────────────────────────┘
       ▼
┌──────────────────────────────┐
│ Dashboard shows:             │
│ - "Welcome back, testuser!"  │
│ - "No questions yet"         │
│ - Add Question button        │
│ - View Stats button          │
│ - Logout button              │
└──────────────────────────────┘


Step 5: Add Question
┌──────────────────┐
│ Click "Add       │
│  Question"       │
└──────┬───────────┘
       │
       ▼
┌────────────────────────────────┐
│  /add-question Page            │
│  - Title field                 │
│  - Difficulty dropdown         │
│  - Category field              │
│  - Status dropdown             │
│  - Notes textarea              │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ Fill form & Submit             │
│ POST /api/questions            │
│ Cookie sent automatically ✅   │
└──────┬─────────────────────────┘
       │
       ├─── Success ────────────────────┐
       │                                │
       ▼                                ▼
┌──────────────────┐        ┌──────────────────────────┐
│ Redirect to      │        │ Backend:                 │
│  /dashboard      │        │ - Validates auth         │
└──────┬───────────┘        │ - Gets user from token   │
       │                    │ - Creates question in DB │
       │                    │ - Links to user          │
       │                    └──────────────────────────┘
       ▼
┌──────────────────────────────┐
│ Dashboard reloads questions  │
│ - Shows new question         │
│ - Title: "Two Sum"           │
│ - Difficulty: Easy           │
│ - Status: Solved             │
└──────────────────────────────┘


Step 6: Page Refresh (Session Persistence)
┌──────────────────┐
│ User presses F5  │
└──────┬───────────┘
       │
       ▼
┌────────────────────────────────┐
│ Page reloads                   │
│ - Cookie still in browser ✅   │
│ - Username in localStorage ✅  │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ AuthContext Initialization     │
│ 1. Finds cookie ✅             │
│ 2. Finds username ✅           │
│ 3. Calls validateToken()       │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ GET /api/questions             │
│ (validation request)           │
└──────┬─────────────────────────┘
       │
       ├─── Success (200) ─────────────┐
       │                               │
       ▼                               ▼
┌──────────────────┐        ┌──────────────────┐
│ Sets auth state: │        │ Backend:         │
│ authenticated=true│        │ - Token valid ✅ │
│ username="test"  │        └──────────────────┘
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────┐
│ User stays logged in ✅      │
│ Dashboard loads normally     │
└──────────────────────────────┘


Step 7: Logout
┌──────────────────┐
│ Click "Logout"   │
└──────┬───────────┘
       │
       ▼
┌────────────────────────────────┐
│ logout() called                │
│ POST /api/auth/logout          │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ Backend:                       │
│ - Creates new cookie           │
│ - Sets MaxAge = 0 (delete)     │
│ - Sends in response            │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ Frontend:                      │
│ 1. Browser deletes cookie ✅   │
│ 2. Remove username from        │
│    localStorage                │
│ 3. Update AuthContext:         │
│    - authenticated = false     │
│    - username = null           │
└──────┬─────────────────────────┘
       │
       ▼
┌──────────────────┐
│ Redirect to      │
│     /login       │
└──────────────────┘
```

---

## 🔄 Alternative Flows

### **Flow A: Returning User (Valid Session)**
```
Visit / 
  → Home checks auth
  → Has valid cookie ✅
  → validateToken() succeeds
  → Redirect to /dashboard
  → Questions load immediately
```

### **Flow B: Expired Session**
```
Visit /dashboard
  → Cookie expired/missing
  → Username still in storage
  → API call fails (401)
  → API interceptor detects:
    - wasAuthenticated = true
    → Redirect to /login?session=expired
  → Show yellow banner
  → User logs in again
```

### **Flow C: Direct Dashboard Access (Not Authenticated)**
```
Visit /dashboard
  → ProtectedRoute checks auth
  → Not authenticated
  → Redirect to /login
  → Clean URL (no session expired)
```

---

## 🎯 Key Improvements Made

### **1. Initial Load Optimization**
```
BEFORE:
New user → AuthContext tries to logout → API call fails → Error

AFTER:
New user → AuthContext checks storage → No data → Just set state ✅
```

### **2. Token Validation**
```
BEFORE:
Always calls /api/questions → 401 for new users

AFTER:
Checks cookie exists first → Skip validation if no cookie ✅
```

### **3. API Interceptor**
```
BEFORE:
Any 401 → Redirect to login?session=expired

AFTER:
401 + was authenticated → login?session=expired
401 + never authenticated → login (clean)
401 + on public pages → No redirect ✅
```

### **4. Home Routing**
```
BEFORE:
/ → /dashboard → 401 → /login?session=expired

AFTER:
/ → Check auth → Not authenticated → /login (clean) ✅
```

---

## ✅ Final State

**Your app now has:**
- ✅ Clean authentication flow for new users
- ✅ No unnecessary API calls on first visit
- ✅ Proper session management with cookies
- ✅ Smart routing based on auth state
- ✅ Clear distinction between expired session vs new user
- ✅ Excellent error handling throughout
- ✅ Multi-user isolation and security

**Ready for production! 🚀**
