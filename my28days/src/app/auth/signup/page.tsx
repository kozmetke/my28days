'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineGoogle } from 'react-icons/ai';
import OnboardingQuestions from '@/components/onboarding/OnboardingQuestions';

export default function SignUp() {
  const [showQuestions, setShowQuestions] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = (result: string) => {
    setResult(result);
    setShowQuestions(false);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Sign in after successful registration
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/onboarding',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
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
              Create your account
            </h2>
          </div>

          {result && (
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 text-center">
              <p className="text-pink-900">{result}</p>
              <p className="mt-2 text-sm text-pink-700">
                Join our community to get personalized support and connect with others.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
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
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Sign up with Email'}
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
              Sign up with Google
            </button>

            <div className="text-center">
              <span className="text-neutral-600">Already have an account? </span>
              <button
                onClick={() => {
                  const signinPage = document.createElement('a');
                  signinPage.href = '/auth/signin';
                  signinPage.setAttribute('data-result', result || '');
                  signinPage.click();
                }}
                className="text-pink-600 hover:text-pink-500 font-medium"
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm text-neutral-600">
            <p className="text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-pink-600 hover:text-pink-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-pink-600 hover:text-pink-500">
                Privacy Policy
              </Link>
            </p>
            <p className="text-center text-xs text-neutral-500">
              We'll never post anything without your permission.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
