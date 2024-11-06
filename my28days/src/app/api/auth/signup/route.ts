import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import { createFlowAccount } from '@/lib/flow';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create Flow wallet
    const flowAccount = await createFlowAccount();

    // Create new user with Flow wallet
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      flowWallet: {
        address: flowAccount.address,
        privateKey: flowAccount.privateKey,
        publicKey: flowAccount.publicKey
      }
    });

    // Remove sensitive data from response
    const { password: _, flowWallet: { privateKey: __, ...safeWallet }, ...safeUser } = user.toObject();
    const userResponse = {
      ...safeUser,
      flowWallet: safeWallet
    };

    return NextResponse.json(
      { message: 'User created successfully', user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}
