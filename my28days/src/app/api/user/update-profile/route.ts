import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update the session with onboarding completed
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          onboardingCompleted: true
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update session');
    }

    // Return the updated user data
    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: {
          ...session.user,
          onboardingCompleted: true,
          updatedAt: new Date().toISOString()
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
