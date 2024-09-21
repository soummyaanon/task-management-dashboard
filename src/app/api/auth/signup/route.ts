import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Connecting to database...')
    await connectToDatabase()
    console.log('Connected to database')

    console.log('Checking for existing user...')
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    console.log('Creating new user...')
    const newUser = new User({ name, email, password })
    await newUser.save()
    console.log('User created successfully')

    const token = signToken(newUser._id.toString())
    setAuthCookie(token)

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error: any) {
    console.error('Signup error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}