// Script to create demo users for testing
// Run this in the browser console or as a Node.js script

const createDemoUsers = async () => {
  const users = [
    {
      name: "Alex Chen",
      email: "student@demo.com",
      password: "password123",
      role: "student",
      collegeCode: "IITD",
      rollNumber: "21CS001",
      branch: "Computer Science",
      graduationYear: 2025,
    },
    {
      name: "Priya Sharma",
      email: "student2@demo.com",
      password: "password123",
      role: "student",
      collegeCode: "IITD",
      rollNumber: "21CS002",
      branch: "Computer Science",
      graduationYear: 2025,
    },
    {
      name: "Rahul Kumar",
      email: "student3@demo.com",
      password: "password123",
      role: "student",
      collegeCode: "IITD",
      rollNumber: "21CS003",
      branch: "Computer Science",
      graduationYear: 2025,
    },
    {
      name: "IIT Delhi Placement Office",
      email: "college@demo.com", 
      password: "password123",
      role: "college",
      collegeName: "Indian Institute of Technology Delhi",
      collegeCode: "IITD",
      location: "New Delhi, India",
      placementOfficerName: "Dr. Rajesh Kumar",
      placementOfficerEmail: "placement@iitd.ac.in",
    },
    {
      name: "Sarah Johnson",
      email: "recruiter@demo.com",
      password: "password123", 
      role: "recruiter",
      companyName: "Tech Innovations Inc",
      designation: "Senior Technical Recruiter",
      companySize: "500-1000",
      industry: "Technology",
    }
  ]

  for (const user of users) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        console.log(`✅ Created ${user.role} user: ${user.email}`)
      } else {
        console.log(`❌ Failed to create ${user.role} user: ${result.error}`)
      }
    } catch (error) {
      console.log(`❌ Error creating ${user.role} user:`, error)
    }
  }
}

// Uncomment to run (make sure you're on the signup page or have the API available)
// createDemoUsers()

export { createDemoUsers }