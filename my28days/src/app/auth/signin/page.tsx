'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineGoogle, AiOutlineMail } from 'react-icons/ai';
import OnboardingQuestions from '@/components/onboarding/OnboardingQuestions';

export default function SignIn() {
  const [showQuestions, setShowQuestions] = useState(false); // Changed to false to show sign-in form directly
  const [result, setResult] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = (result: string) => {
    setResult(result);
    setShowQuestions(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        window.location.href = '/onboarding';
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
      {showQuestions ? (
        <OnboardingQuestions onComplete={handleComplete} />
      ) : (
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/logo.png"
              alt="My28Days"
              width={48}
              height={48}
              className="mx-auto"
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900">
              Welcome to My28Days
            </h2>
          </div>

          {result && (
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 text-center">
              <p className="text-pink-900">{result}</p>
            </div>
          )}

          <div className="space-y-4">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in with Email'}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-50 text-neutral-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
            >
              <AiOutlineGoogle className="w-5 h-5" />
              Sign in with Google
            </button>

            <div className="text-center">
              <span className="text-neutral-600">Don't have an account? </span>
              <button
                onClick={() => {
                  const signupPage = document.createElement('a');
                  signupPage.href = '/auth/signup';
                  signupPage.setAttribute('data-result', result || '');
                  signupPage.click();
                }}
                className="text-pink-600 hover:text-pink-500 font-medium"
              >
                Sign up
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-neutral-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-pink-600 hover:text-pink-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-pink-600 hover:text-pink-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
