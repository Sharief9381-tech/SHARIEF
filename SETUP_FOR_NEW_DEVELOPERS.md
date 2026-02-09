# 🚀 Setup Guide for New Developers

This guide will help you set up the CodeTrack project on your local machine.

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- MongoDB (optional - fallback auth works without it)
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/Sharief9381-tech/Code_Track_Platform.git
cd Code_Track_Platform
```

## Step 2: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection (Optional - fallback auth works without it)
MONGODB_URI=your_mongodb_connection_string

# Session Secret (Required)
SESSION_SECRET=your-secret-key-here

# Other optional variables
NODE_ENV=development
```

**Note**: If you don't have MongoDB, the app will use in-memory fallback authentication automatically.

## Step 4: Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Step 5: Create Admin User

After starting the server, create the admin user by visiting:

```
http://localhost:3000/api/debug/create-admin
```

Or run this script:

```bash
node check-admin.js
```

You should see:
```
✅ Admin user created successfully!
📧 Email: sharief9381@gmail.com
🔑 Password: 12341234
```

## Step 6: Login and Test

1. **Go to login page**: `http://localhost:3000/login`

2. **Login as admin**:
   - Email: `sharief9381@gmail.com`
   - Password: `12341234`

3. **You'll be redirected to**: `http://localhost:3000/admin`

## Available User Roles

### Admin
- **Email**: `sharief9381@gmail.com`
- **Password**: `12341234`
- **Dashboard**: `/admin`

### Demo Users (Create via signup)
- **Student**: Sign up at `/signup` with role "Student"
- **College**: Sign up at `/signup` with role "College"
- **Recruiter**: Sign up at `/signup` with role "Recruiter"

## Common Issues & Solutions

### Issue 1: Homepage Just Shows Landing Page

**Solution**: This is normal! The homepage shows the landing page for non-authenticated users. To access the app:
1. Click "Sign In" button on the homepage
2. Or go directly to `/login`
3. Login with your credentials
4. You'll be redirected to your dashboard

### Issue 2: "Invalid email or password"

**Solution**: You need to create the admin user first:
```bash
# Visit this URL in your browser
http://localhost:3000/api/debug/create-admin

# Or run the script
node check-admin.js
```

### Issue 3: MongoDB Connection Error

**Solution**: The app works without MongoDB! It uses fallback authentication:
- User data stored in memory
- Sessions work normally
- All features available
- Data clears on server restart

### Issue 4: Port Already in Use

**Solution**: 
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue 5: Build Errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── student/           # Student dashboard
│   ├── college/           # College dashboard
│   ├── recruiter/         # Recruiter dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── database.ts       # Database connection
│   └── platforms/        # Platform integrations
├── scripts/              # Utility scripts
└── public/               # Static assets
```

## Development Workflow

1. **Pull latest changes**:
   ```bash
   git pull origin main
   ```

2. **Install new dependencies** (if package.json changed):
   ```bash
   npm install
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```

4. **Make your changes**

5. **Test your changes**:
   - Test all user roles
   - Check responsive design
   - Verify API endpoints

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clear database
node scripts/clear-database.js

# Create admin user
node check-admin.js

# Run tests (if available)
npm test
```

## Testing Different Roles

### Test as Student
1. Go to `/signup`
2. Fill in student details
3. Login and access `/student/dashboard`

### Test as College
1. Go to `/signup`
2. Fill in college details
3. Login and access `/college/dashboard`

### Test as Recruiter
1. Go to `/signup`
2. Fill in recruiter details
3. Login and access `/recruiter/dashboard`

### Test as Admin
1. Login with `sharief9381@gmail.com` / `12341234`
2. Access `/admin` dashboard
3. View all users and system metrics

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/user-details?email=xxx` - Get user details

### Debug (Development Only)
- `GET /api/debug/create-admin` - Create admin user
- `GET /api/debug/users` - List all users
- `POST /api/debug/clear-mongodb` - Clear database

## Need Help?

1. Check the documentation files:
   - `README.md` - Project overview
   - `TESTING_INSTRUCTIONS.md` - Testing guide
   - `TROUBLESHOOTING.md` - Common issues
   - `ADMIN_CREDENTIALS.md` - Admin access info

2. Check the browser console for errors

3. Check the terminal for server logs

4. Ask your team members!

## Important Notes

⚠️ **Admin Credentials**: Keep `sharief9381@gmail.com` / `12341234` secure  
⚠️ **Database**: Data is cleared when you run `clear-database.js`  
⚠️ **Environment**: Make sure `.env.local` is in `.gitignore`  
⚠️ **Port**: Default port is 3000, change in `package.json` if needed  

## Happy Coding! 🎉

If you encounter any issues not covered here, please:
1. Check existing documentation
2. Search for similar issues
3. Ask your team
4. Document the solution for others
