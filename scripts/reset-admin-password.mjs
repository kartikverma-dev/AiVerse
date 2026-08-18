import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    const parts = line.split('=')
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const val = parts.slice(1).join('=').trim()
      process.env[key] = val
    }
  })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const ADMIN_EMAIL = 'kartikverma0804@gmail.com'
const newPassword = process.argv[2]

if (!newPassword) {
  console.log('Usage: node scripts/reset-admin-password.mjs <new_password>')
  process.exit(1)
}

async function resetPassword() {
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing users:', listError)
    process.exit(1)
  }

  const user = usersData.users.find(u => u.email === ADMIN_EMAIL)
  if (!user) {
    console.log(`User ${ADMIN_EMAIL} not found. Creating user...`)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: newPassword,
      email_confirm: true,
    })
    if (createError) {
      console.error('Error creating user:', createError)
    } else {
      console.log(`Success! Created admin user ${ADMIN_EMAIL} with the new password.`)
    }
  } else {
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    })
    if (updateError) {
      console.error('Error updating password:', updateError)
    } else {
      console.log(`Success! Password for ${ADMIN_EMAIL} has been updated.`)
    }
  }
}

resetPassword()
