# 🧪 Quick Test Checklist

## Open the App
1. Go to: `http://localhost:5173`
2. You should see the **Login Page** with logo

## ✅ Test Login (2 minutes)

### Valid Login
- [ ] Enter: `admin@admin.com` / `admin123`
- [ ] Click "Sign In"
- [ ] See loading spinner
- [ ] See success toast
- [ ] Redirected to Dashboard
- [ ] See sidebar with all modules

### Invalid Login
- [ ] Enter: `wrong@email.com` / `wrong123`
- [ ] Click "Sign In"
- [ ] See error toast: "Invalid email or password"
- [ ] Stay on login page

## ✅ Test Logout (1 minute)

- [ ] Scroll to bottom of sidebar
- [ ] See your user info (Admin User, admin@admin.com)
- [ ] Click "Logout" button
- [ ] See confirmation dialog
- [ ] Click "OK"
- [ ] See "Logging out..." text
- [ ] Redirected to login page

## ✅ Test Protected Routes (1 minute)

- [ ] Logout first
- [ ] Try to access: `http://localhost:5173/users`
- [ ] Should redirect to login
- [ ] Try to access: `http://localhost:5173/workers`
- [ ] Should redirect to login

## ✅ Test Session Persistence (30 seconds)

- [ ] Login successfully
- [ ] Press F5 to refresh
- [ ] Should stay logged in
- [ ] Should see dashboard

## ✅ Test All Features (2 minutes)

After logging in, test these:

### Categories
- [ ] Click "Add Category" → Modal opens
- [ ] Add new category → Appears in table
- [ ] Click edit → Modal opens with data
- [ ] Click delete → Confirms and removes

### Users
- [ ] Search for a user → Filters work
- [ ] Click "Issue Credits" → Modal opens
- [ ] Submit → Credits added

### Workers
- [ ] Switch tabs → Content changes
- [ ] Click verify icon → Badge toggles
- [ ] Click approve → Status changes

### Pricing
- [ ] Click "Edit" → Modal opens
- [ ] Change price → Updates immediately

### Featured
- [ ] Click "Approve" → Moves to active
- [ ] Click up arrow → Priority changes

## 🎯 Expected Results

All checkboxes should be ✅

If any test fails, check:
1. Dev server is running
2. No console errors (F12)
3. localStorage has token (F12 > Application)

---

**Total Test Time: ~7 minutes**

**Demo Credentials:**
- Email: `admin@admin.com`
- Password: `admin123`
