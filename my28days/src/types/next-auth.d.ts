import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboardingCompleted: boolean;
      role: 'patient' | 'doctor' | 'admin';
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    onboardingCompleted: boolean;
    role: 'patient' | 'doctor' | 'admin';
  }

  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    onboardingCompleted: boolean;
    role: 'patient' | 'doctor' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    onboardingCompleted: boolean;
    role: 'patient' | 'doctor' | 'admin';
  }
}
