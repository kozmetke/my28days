'use client';

import { useSession } from 'next-auth/react';
import Navbar from '@/components/navigation/Navbar';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const hasCompletedOnboarding = session?.user?.onboardingCompleted;

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Hidden on mobile and when not authenticated */}
      {session && (
        <div className="hidden md:flex md:w-[275px] lg:w-[350px] fixed left-0 top-0 h-full border-r border-neutral-100">
          <div className="flex flex-col p-4 w-full">
            <div className="py-4">
              <img src="/logo.png" alt="My28Days" className="h-8 w-auto" />
            </div>
            <Navbar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${session ? 'md:ml-[275px] lg:ml-[350px]' : ''} ${hasCompletedOnboarding ? 'md:mr-[275px] lg:mr-[350px]' : ''} pb-32 md:pb-0`}>
        {children}
      </main>

      {/* Right Sidebar with Chat - Hidden on mobile and when not authenticated or onboarding not completed */}
      {session && hasCompletedOnboarding && (
        <div className="hidden md:block md:w-[275px] lg:w-[350px] fixed right-0 top-0 h-full border-l border-neutral-100">
          <div className="flex flex-col h-full p-4">
            <div className="mb-4 rounded-xl bg-neutral-50 p-4">
              <h2 className="font-semibold text-neutral-900">Welcome to My28Days</h2>
              <p className="mt-2 text-sm text-neutral-600">
                A supportive community for women going through menopause.
                Share your journey, connect with others, and find support.
              </p>
            </div>
            
            {/* Chat Window - Takes remaining height */}
            <div className="flex-1 min-h-0">
              <ChatWindow />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation and Chat - Only shown when authenticated and onboarding completed */}
      {session && hasCompletedOnboarding && (
        <div className="md:hidden">
          {/* Chat Window - Above bottom nav */}
          <ChatWindow />
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100">
            <Navbar />
          </div>
        </div>
      )}
    </div>
  );
}
