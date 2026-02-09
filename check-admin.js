// Check if admin user exists and create if needed
const checkAndCreateAdmin = async () => {
  console.log('🔍 Checking admin user status...\n')
  
  try {
    // First, try to create the admin user
    console.log('1️⃣ Attempting to create admin user...')
    const createResponse = await fetch('http://localhost:3000/api/debug/create-admin', {
      method: 'GET'
    })
    
    const createResult = await createResponse.json()
    
    if (createResponse.ok) {
      console.log('✅ Admin user created successfully!')
      console.log('\n📧 Email:', createResult.credentials.email)
      console.log('🔑 Password:', createResult.credentials.password)
      console.log('🔗 Access URL:', 'http://localhost:3000/admin')
      console.log('\n✨ You can now login with these credentials!')
    } else {
      console.log('⚠️ Could not create admin user:', createResult.error)
      console.log('\nThis might mean:')
      console.log('- Admin user already exists')
      console.log('- Database connection issue')
      console.log('\nTry logging in with:')
      console.log('Email: sharief9381@gmail.com')
      console.log('Password: 12341234')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n⚠️ Make sure the dev server is running: npm run dev')
  }
}

checkAndCreateAdmin()
