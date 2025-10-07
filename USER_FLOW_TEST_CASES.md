# Complete User Flow Test Cases

## 🧪 New User Flow (Complete Journey)

### **Test Case 1: First-Time Visitor**

**Expected Flow:**
```
1. Visit https://recurser-dsa.netlify.app
   ✅ Should redirect to /login (clean URL, no "session expired")
   ✅ Should see "DSA Tracker" heading
   ✅ Should see "Sign in to your account"
   ✅ Should see "Don't have an account? Sign up" link

2. Click "Sign up" link
   ✅ Should redirect to /register
   ✅ Should see "Create Account" heading
   ✅ Form should have: username, password, confirm password fields

3. Fill registration form:
   - Username: testuser123
   - Password: password123
   - Confirm: password123
   
4. Click "Create account"
   ✅ Should show "Registration successful!" message
   ✅ Should auto-redirect to /login after 2 seconds

5. Login with new credentials
   ✅ Should redirect to /dashboard
   ✅ Should see "Welcome back, testuser123!"
   ✅ Cookie should be set (check DevTools → Application → Cookies)
   ✅ Should see empty state: "No questions yet"

6. Click "Add Question"
   ✅ Should redirect to /add-question
   ✅ Form should have: title, difficulty, category, status, notes

7. Fill question form:
   - Title: Two Sum
   - Difficulty: Easy
   - Category: Arrays
   - Status: Solved
   - Notes: Use hash map for O(n) solution
   
8. Click "Add Question"
   ✅ Should redirect to /dashboard
   ✅ Should see the new question in the list

9. Refresh the page (F5)
   ✅ Should stay logged in
   ✅ Should still see the question
   ✅ No redirect to login

10. Click "View Stats"
    ✅ Should show statistics page
    ✅ Should show: Total: 1, Easy: 1, Solved: 1

11. Click "Logout"
    ✅ Should redirect to /login
    ✅ Cookie should be cleared
    ✅ Cannot access /dashboard anymore
```

---

## 🔄 Returning User Flow

### **Test Case 2: User With Active Session**

**Expected Flow:**
```
1. Visit https://recurser-dsa.netlify.app (with valid cookie)
   ✅ Should redirect directly to /dashboard
   ✅ Should see username and questions immediately
   ✅ No login required

2. Access /login directly
   ✅ Should redirect to /dashboard
   ✅ No need to login again

3. Close browser and reopen (within 24 hours)
   ✅ Should still be logged in
   ✅ Cookie persists across browser restarts
```

---

### **Test Case 3: Expired Session**

**Expected Flow:**
```
1. User was logged in (has username in localStorage)
2. Cookie expires or gets deleted
3. Try to access /dashboard

   ✅ Should redirect to /login?session=expired
   ✅ Should see yellow banner: "Your session has expired. Please log in again."
   ✅ After login, should redirect to dashboard
```

---

## 🎯 Feature Testing

### **Test Case 4: Question Management**

**Add Question:**
```
1. Login → Dashboard → "Add Question"
2. Fill form with valid data
3. Click "Add Question"
   ✅ Redirects to dashboard
   ✅ Question appears in list
   ✅ No authentication errors
```

**Edit Question:**
```
1. Dashboard → Click "Edit" on a question
2. Modify the fields
3. Click "Update Question"
   ✅ Question updates successfully
   ✅ Changes visible immediately
```

**Delete Question:**
```
1. Dashboard → Click "Delete" on a question
2. Confirm deletion
   ✅ Question removed from list
   ✅ Count updates correctly
```

**Filter Questions:**
```
1. Dashboard → Use difficulty filter
   ✅ Shows only selected difficulty
2. Use status filter
   ✅ Shows only selected status
```

---

### **Test Case 5: Statistics Page**

**Expected Behavior:**
```
1. Add questions with various difficulties and statuses
2. Visit /stats page

   ✅ Total count correct
   ✅ Difficulty breakdown correct (Easy/Medium/Hard)
   ✅ Status breakdown correct (Todo/Solved/Review)
   ✅ Percentages calculated correctly
   ✅ Charts/progress bars display properly
```

---

## 🔐 Authentication Edge Cases

### **Test Case 6: Invalid Credentials**

**Expected Flow:**
```
1. Login with wrong password
   ✅ Should show error: "Bad credentials" or "Login failed"
   ✅ Should NOT redirect
   ✅ Form should remain filled (username preserved)
   ✅ Can try again immediately

2. Login with non-existent username
   ✅ Should show error message
   ✅ No redirect or crash
```

---

### **Test Case 7: Duplicate Username**

**Expected Flow:**
```
1. Register with existing username
   ✅ Should show error: "Username is already taken!"
   ✅ Should NOT create account
   ✅ Form remains on registration page
   ✅ Can try with different username
```

---

### **Test Case 8: Password Validation**

**Expected Flow:**
```
1. Register with password < 6 characters
   ✅ Should show error: "Password must be at least 6 characters"

2. Register with mismatched passwords
   ✅ Should show error: "Passwords do not match"

3. Both validations work before API call
   ✅ No unnecessary backend requests
```

---

## 🌐 Multi-User Testing

### **Test Case 9: Concurrent Users**

**Expected Flow:**
```
1. User A logs in (Browser 1)
   ✅ Sees their own questions

2. User B logs in (Browser 2 or Incognito)
   ✅ Sees their own questions
   ✅ Does NOT see User A's questions

3. User A adds a question
   ✅ User B doesn't see it
   ✅ Data is isolated per user

4. User A logs out
   ✅ User B remains logged in
   ✅ No interference between sessions
```

---

### **Test Case 10: Same Browser, Different Users**

**Expected Flow:**
```
1. User A logs in → Works
2. User A logs out → Cookie cleared
3. User B logs in → Works
   ✅ No leftover data from User A
   ✅ Cookie properly replaced
   ✅ No authentication conflicts
```

---

## 🔄 Navigation Testing

### **Test Case 11: Direct URL Access**

**Without Authentication:**
```
1. Visit /dashboard directly
   ✅ Redirects to /login

2. Visit /add-question directly
   ✅ Redirects to /login

3. Visit /stats directly
   ✅ Redirects to /login

4. Visit /login directly
   ✅ Shows login page (no redirect loop)

5. Visit /register directly
   ✅ Shows registration page
```

**With Authentication:**
```
1. Visit /login directly
   ✅ Redirects to /dashboard

2. Visit /register directly
   ✅ Redirects to /dashboard

3. Visit / (root)
   ✅ Redirects to /dashboard

4. Visit /dashboard, /add-question, /stats
   ✅ All work properly
```

---

## 🔍 Cookie & Security Testing

### **Test Case 12: Cookie Attributes**

**Check in DevTools (F12 → Application → Cookies):**
```
Cookie Name: jwt-token
✅ HttpOnly: true (cannot access via JavaScript)
✅ SameSite: Lax (CSRF protection)
✅ Secure: false (for HTTP), true (for HTTPS in production)
✅ Path: /
✅ Max-Age: 86400 (24 hours)
✅ Domain: Your domain
```

**JavaScript Access Test:**
```javascript
// In browser console
console.log(document.cookie);
// ✅ Should NOT show jwt-token (it's HttpOnly)
// ✅ Should be empty or show only non-HttpOnly cookies
```

---

### **Test Case 13: CORS Configuration**

**Expected Behavior:**
```
1. Frontend (Netlify) → Backend (Render)
   ✅ No CORS errors in console
   ✅ Cookies sent automatically
   ✅ All API calls work

2. Try accessing API from other domain
   ✅ Should get CORS error
   ✅ Only configured origins allowed
```

---

## ⚡ Performance & Loading

### **Test Case 14: Loading States**

**Expected Behavior:**
```
1. Initial page load
   ✅ Shows "Loading..." briefly
   ✅ Then shows content or redirects

2. Dashboard loading questions
   ✅ Shows "Loading..." while fetching
   ✅ Then shows questions or empty state

3. Form submissions
   ✅ Button shows "Loading..." or "Creating..."
   ✅ Button disabled during submission
   ✅ Re-enables after completion
```

---

## 🐛 Error Handling

### **Test Case 15: Network Errors**

**Simulate Offline:**
```
1. Turn off network
2. Try to login
   ✅ Should show error message
   ✅ Should not crash
   ✅ Can retry when back online

3. Dashboard when offline
   ✅ Shows error: "Failed to load questions"
   ✅ Graceful degradation
```

---

### **Test Case 16: Backend Down**

**If Backend is Down:**
```
1. Try to login
   ✅ Shows connection error
   ✅ No infinite loading
   ✅ Clear error message

2. Already logged in, refresh page
   ✅ Token validation fails gracefully
   ✅ Redirects to login with session expired message
```

---

## ✅ Acceptance Criteria

**All must pass for production readiness:**

- [ ] New user can register successfully
- [ ] New user can login after registration
- [ ] Cookie is set correctly with proper attributes
- [ ] User stays logged in after page refresh
- [ ] Session expires properly after 24 hours
- [ ] Logout clears cookie completely
- [ ] Multiple users can use the app independently
- [ ] Protected routes redirect to login when not authenticated
- [ ] No "session expired" message for first-time visitors
- [ ] No authentication errors when adding/editing questions
- [ ] Stats page shows correct counts
- [ ] All forms have proper validation
- [ ] Error messages are clear and helpful
- [ ] Loading states are shown appropriately
- [ ] No CORS errors in browser console
- [ ] No authentication conflicts between users

---

## 🎯 Quick Smoke Test

**5-Minute Validation (After Deployment):**

```
1. Visit site → Should show login page (clean URL) ✅
2. Register new account ✅
3. Login successfully ✅
4. Add a question ✅
5. Refresh page → Stay logged in ✅
6. Check cookie in DevTools ✅
7. Logout → Cookie cleared ✅
8. Login again → Works ✅
9. View stats → Shows correct data ✅
10. Open in Incognito → Login with different user ✅
```

**If all 10 pass → Deployment successful! 🎉**

---

## 📝 Testing Checklist

### Frontend:
- [ ] Home routing works correctly
- [ ] Login form validates input
- [ ] Registration form validates input
- [ ] Protected routes redirect properly
- [ ] Cookie is sent with all requests
- [ ] API interceptor handles errors
- [ ] Loading states show correctly
- [ ] Error messages display properly

### Backend:
- [ ] `/api/auth/**` endpoints are public
- [ ] Cookie is set on login
- [ ] Cookie is cleared on logout
- [ ] JWT validation works correctly
- [ ] CORS allows frontend origin
- [ ] Questions endpoint requires auth
- [ ] Database queries work correctly
- [ ] User data is isolated per user

### Integration:
- [ ] End-to-end registration works
- [ ] End-to-end login works
- [ ] Question CRUD operations work
- [ ] Stats calculation is accurate
- [ ] Session management works
- [ ] Multi-user isolation works
- [ ] Cookie security is correct
- [ ] Error handling is robust

---

**Test Environment:** Production  
**Last Updated:** October 7, 2025  
**Status:** Ready for testing ✅
