// Simple script to create admin user
// Run this in your browser console when on localhost:3000

const createAdmin = async () => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Admin User",
        email: "admin@codetrack.com",
        password: "admin123",
        role: "college", // We'll use college role since admin check is email-based
        collegeName: "CodeTrack Admin",
        collegeCode: "ADMIN",
        location: "System",
        placementOfficerName: "System Admin",
        placementOfficerEmail: "admin@codetrack.com",
      })
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Admin user created successfully!')
      console.log('Email: admin@codetrack.com')
      console.log('Password: admin123')
      console.log('You can now access /admin')
    } else {
      console.log('❌ Failed to create admin:', result.error)
    }
  } catch (error) {
    console.log('❌ Error:', error)
  }
}

createAdmin()