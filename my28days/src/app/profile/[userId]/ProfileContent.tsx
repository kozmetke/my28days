"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { db } from '@/lib/data';
import ValidationContent from '@/components/validation/ValidationContent';

interface ProfileContentProps {
  userId: string;
}

export default function ProfileContent({ userId }: ProfileContentProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('posts');
  const user = db.getUserById(userId);

  if (!user) {
    return <div>User not found</div>;
  }

  const isCurrentUser = session?.user?.id === userId;
  const canAccessValidation = user.role === 'doctor' || user.role === 'admin';

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'about', label: 'About' },
    ...(canAccessValidation ? [{ id: 'validation', label: 'Validation' }] : []),
  ];

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              <Image
                src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="rounded-full"
                fill
                sizes="(max-width: 96px) 96px"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'posts' && (
          <div>
            {/* Posts content */}
            <p>Posts content coming soon...</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            {/* About content */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Bio</h3>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
                {user.flowWallet?.address && (
                  <div>
                    <h3 className="text-lg font-medium">Flow ID</h3>
                    <p className="text-gray-600 font-mono bg-gray-50 p-2 rounded mt-1 break-all">
                      {user.flowWallet.address}
                    </p>
                  </div>
                )}
                {user.medicalInfo && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium">Symptoms</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.medicalInfo.symptoms?.map((symptom) => (
                          <span
                            key={symptom}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Treatments</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.medicalInfo.treatments?.map((treatment) => (
                          <span
                            key={treatment}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            {treatment}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validation' && canAccessValidation && (
          <ValidationContent />
        )}
      </div>
    </div>
  );
}
