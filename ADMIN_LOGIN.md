# 🔐 Admin Login Credentials

## Quick Access

**Email**: `sharief9381@gmail.com`  
**Password**: `12341234`  
**URL**: `http://localhost:3000/admin`

## Setup Steps

1. **Create Admin User**:
   ```
   Visit: http://localhost:3000/api/debug/create-admin
   ```
   Or use browser console at localhost:3000 and run the code from `create-admin.js`

2. **Login**:
   ```
   Go to: http://localhost:3000/login
   Email: sharief9381@gmail.com
   Password: 12341234
   ```

3. **Access Admin Dashboard**:
   ```
   After login, you'll be redirected to: http://localhost:3000/admin
   ```

## Features Available

✅ System Overview - Total users, active users, platform stats  
✅ User Management - View all users by role  
✅ Live Activity Feed - Real-time user actions with full details  
✅ Platform Health - Monitor all coding platform integrations  
✅ System Metrics - CPU, memory, API calls, error rates  
✅ User Details Modal - Click any activity to see complete user profile  

## Important Notes

- Admin access is determined by email address
- The admin user has "college" role in database but special email-based access
- All admin routes check for `user.email === "sharief9381@gmail.com"`
- Database has been cleared and is ready for fresh admin user creation

## Troubleshooting

**Can't login?**
- Make sure you created the admin user first
- Check that you're using the correct email and password
- Try clearing browser cookies and cache

**Not redirecting to admin dashboard?**
- Logout and login again
- Check browser console for errors
- Verify the admin user was created successfully

**No activity showing?**
- Login as other users (student/college/recruiter) in another browser
- Perform some actions (navigate pages, link platforms)
- The admin dashboard will update automatically
