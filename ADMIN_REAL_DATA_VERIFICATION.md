# Admin Dashboard - Real Data Verification Guide

## Current Implementation Status

The admin dashboard is now configured to show **REAL user data** from the database and analytics system. Here's how to verify it's working correctly:

## How Real Data Flows

### 1. User Actions Are Tracked
When any user (student/college/recruiter) performs an action:
- **Login** → Tracked with user's name, email, role
- **Page View** → Tracked with current page and user info
- **Platform Link** → Tracked with platform name and user info
- **Profile Update** → Tracked with user info

### 2. Data Storage
All events are stored in MongoDB `analytics` collection with:
```json
{
  "type": "user_login",
  "userEmail": "student@demo.com",
  "userName": "John Doe",
  "userRole": "student",
  "page": "/student/dashboard",
  "timestamp": "2026-02-06T10:30:00Z",
  "ip": "192.168.1.100",
  "userDetails": {
    "collegeCode": "MIT2024",
    "branch": "Computer Science",
    "graduationYear": 2024
  }
}
```

### 3. Admin Dashboard Fetches Real Data
The admin dashboard API (`/api/admin/dashboard`) fetches:
- Real user counts from `users` collection
- Real analytics events from `analytics` collection
- Real platform connections from user profiles
- Real coding statistics from student stats

## Verification Steps

### Step 1: Check Database Connection
```bash
# The system should show database status
# Visit: http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
```

### Step 2: Perform Test Actions
1. **Login as Student**:
   - Email: `student@demo.com`
   - Password: `password123`
   - This creates a `user_login` event

2. **Navigate to Dashboard**:
   - This creates `page_view` events

3. **Link a Platform**:
   - Go to Platforms page
   - Link LeetCode/GitHub
   - This creates `platform_link` event

### Step 3: View as Admin
1. **Login as Admin**:
   - Email: `admin@codetrack.com`
   - Password: (your admin password)

2. **Check Activity Tab**:
   - Should show REAL user actions
   - Should show actual user names (not "student user")
   - Should show actual emails
   - Should show correct roles

3. **Click on User**:
   - Modal should show REAL user profile
   - Should show actual college code, branch, etc.
   - Should show real coding statistics

## What You Should See

### ✅ CORRECT (Real Data):
```
Activity Feed:
- John Doe (student@demo.com) logged in to student dashboard
- Sarah Wilson (sarah@demo.com) connected LeetCode account
- MIT Placement (placement@mit.edu) viewed college analytics
```

### ❌ INCORRECT (Mock Data):
```
Activity Feed:
- student user performed an action
- college user viewed /admin
- Unknown User did something
```

## Troubleshooting

### If You See Mock Data:

1. **Check Database Connection**:
   ```javascript
   // In browser console on admin page:
   fetch('/api/health').then(r => r.json()).then(console.log)
   ```

2. **Check Analytics Collection**:
   - Open MongoDB Compass
   - Connect to your database
   - Check `analytics` collection
   - Should have documents with `userEmail`, `userName`, `userRole`

3. **Check User Collection**:
   - Check `users` collection
   - Verify users have `name`, `email`, `role` fields

4. **Force Analytics Tracking**:
   ```javascript
   // In browser console while logged in:
   fetch('/api/analytics', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       type: 'custom',
       action: 'test_event',
       page: window.location.pathname
     })
   }).then(r => r.json()).then(console.log)
   ```

5. **Check Admin API Response**:
   ```javascript
   // In browser console on admin page:
   fetch('/api/admin/dashboard')
     .then(r => r.json())
     .then(data => {
       console.log('Recent Activity:', data.data.recentActivity)
       console.log('User Details:', data.data.recentActivity[0]?.details)
     })
   ```

## Database Setup

If database is not connected, the system falls back to mock data. To use real data:

1. **Set Environment Variables**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/codetrack
   # or
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codetrack
   ```

2. **Restart Server**:
   ```bash
   npm run dev
   ```

3. **Verify Connection**:
   - Check terminal for "MongoDB connected" message
   - Visit `/api/health` endpoint

## Expected Behavior

### With Database Connected:
- ✅ Shows real user names and emails
- ✅ Shows actual user roles
- ✅ Shows real-time activity
- ✅ User details modal shows actual data
- ✅ Statistics are calculated from real data

### Without Database (Fallback):
- ⚠️ Shows mock/demo data
- ⚠️ Generic user names
- ⚠️ Simulated activity
- ⚠️ Demo statistics

## Next Steps

1. **Ensure MongoDB is running**
2. **Set MONGODB_URI in .env.local**
3. **Create test users** (use `/signup` page)
4. **Perform actions** as different users
5. **View as admin** to see real activity

## Support

If you're still seeing mock data after following these steps:
1. Check browser console for errors
2. Check server terminal for errors
3. Verify MongoDB connection string
4. Ensure users exist in database
5. Verify analytics events are being created

The system is designed to show EXACT real-time information when properly configured!
