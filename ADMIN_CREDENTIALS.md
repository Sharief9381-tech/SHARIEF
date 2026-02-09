# Admin Access Credentials

## 🔴 ADMIN USER

### Login Credentials
- **Email**: `sharief9381@gmail.com`
- **Password**: `12341234`
- **Access URL**: `http://localhost:3000/admin`

### How to Create Admin User

If the admin user doesn't exist yet, you have 3 options:

#### Option 1: Use the Debug API (Recommended)
```bash
# Make a POST request to create admin
curl -X POST http://localhost:3000/api/debug/create-admin
```

Or visit in browser:
```
http://localhost:3000/api/debug/create-admin
```

#### Option 2: Use Browser Console
1. Open your browser console (F12)
2. Navigate to `http://localhost:3000`
3. Paste and run the following:

```javascript
fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "System Administrator",
    email: "sharief9381@gmail.com",
    password: "12341234",
    role: "college",
    collegeName: "CodeTrack System",
    collegeCode: "ADMIN",
    location: "System",
    placementOfficerName: "System Admin",
    placementOfficerEmail: "sharief9381@gmail.com",
  })
}).then(r => r.json()).then(console.log)
```

#### Option 3: Use the create-admin.js Script
```bash
# In browser console at localhost:3000
# Copy and paste the contents of create-admin.js
```

## 📊 Admin Dashboard Features

Once logged in as admin, you'll have access to:

### System Overview
- Total users across all roles (Students, Colleges, Recruiters)
- Active users in real-time
- Platform connections statistics
- Total problems solved across the platform

### User Management
- View all users by role
- See detailed user profiles
- Track user activity and engagement
- Monitor platform connections

### Platform Health
- Real-time monitoring of all coding platform integrations
- Response times and connection status
- Sync status for each platform

### Live Activity Feed
- Real-time user actions across the platform
- Detailed event tracking with user information
- Click on any activity to see full user details
- Role-based activity filtering

### System Metrics
- CPU, Memory, and Disk usage
- API call statistics
- Error rates and system health
- Performance monitoring

## 🔐 Security Notes

- Admin access is determined by email (`sharief9381@gmail.com`)
- The admin user is created with "college" role in the database
- Access control checks for `user.email === "sharief9381@gmail.com"`
- All admin routes are protected with authentication middleware

## 🧪 Testing Admin Features

1. **Login as Admin**
   ```
   Email: sharief9381@gmail.com
   Password: 12341234
   ```

2. **Access Admin Dashboard**
   ```
   http://localhost:3000/admin
   ```

3. **Test User Activity Tracking**
   - Login as a student/college/recruiter in another browser/incognito
   - Perform actions (link platforms, view pages, etc.)
   - Watch the admin dashboard update in real-time

4. **Test User Details Modal**
   - Click on any user activity in the Live Activity Feed
   - View complete user profile with all details
   - See linked platforms, stats, and account metadata

## 📝 Other Demo Users

For testing different roles:

### Student
- Email: `student@demo.com`
- Password: `password123`

### College
- Email: `college@demo.com`
- Password: `password123`

### Recruiter
- Email: `recruiter@demo.com`
- Password: `password123`

## 🚀 Quick Start

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Create admin user (if not exists):
   ```bash
   curl -X POST http://localhost:3000/api/debug/create-admin
   ```

3. Login at:
   ```
   http://localhost:3000/login
   ```

4. Access admin dashboard:
   ```
   http://localhost:3000/admin
   ```

## 🔧 Troubleshooting

### Admin user already exists
If you get an error that the admin user already exists, you can:
1. Clear the database: `node scripts/clear-database.js`
2. Or just login with the existing credentials

### Can't access admin dashboard
- Make sure you're logged in with `sharief9381@gmail.com`
- Check that the session is valid
- Try logging out and logging back in

### No activity showing in dashboard
- Make sure MongoDB is connected
- Perform some actions as other users (student/college/recruiter)
- The analytics system tracks all user actions automatically
