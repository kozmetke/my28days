'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { AiOutlineLoading3Quarters, AiOutlineCalendar, AiOutlineWallet } from 'react-icons/ai';
import PostCard from '@/components/posts/PostCard';
import { format } from 'date-fns';
import type { User, Post } from '@/types';

interface ProfileContentProps {
  userId: string;
}

export default function ProfileContent({ userId }: ProfileContentProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  const isCurrentUser = session?.user?.id === userId;
  const isFollowing = user?.followers.includes(session?.user?.id || '');

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!session?.user?.id) return;
    setFollowLoading(true);

    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            followers: data.isFollowing
              ? [...prev.followers, session.user.id]
              : prev.followers.filter(id => id !== session.user.id),
          };
        });
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (!user && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {user && (
        <>
          <div className="px-4 py-3 border-b border-neutral-100">
            <div className="flex items-start space-x-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-neutral-500">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-neutral-900">{user.name}</h1>
                    {user.bio && (
                      <p className="mt-1 text-neutral-600 text-sm">{user.bio}</p>
                    )}
                  </div>
                  {!isCurrentUser && (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                        isFollowing
                          ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800'
                      }`}
                    >
                      {followLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                      ) : (
                        isFollowing ? 'Following' : 'Follow'
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-3 flex items-center space-x-4 text-sm text-neutral-600">
                  <span>{user.followers.length} followers</span>
                  <span>{user.following.length} following</span>
                  {user.medicalInfo?.diagnosisDate && (
                    <div className="flex items-center">
                      <AiOutlineCalendar className="mr-1" />
                      <span>
                        Diagnosed: {format(new Date(user.medicalInfo.diagnosisDate), 'MMM yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`pb-3 ${
                    activeTab === 'posts'
                      ? 'border-b-2 border-neutral-900 text-neutral-900 font-medium'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`pb-3 ${
                    activeTab === 'about'
                      ? 'border-b-2 border-neutral-900 text-neutral-900 font-medium'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  About
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'posts' ? (
            <div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin text-neutral-500" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-600">No posts yet</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUserId={session?.user?.id}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="p-4">
              {user.flowWallet && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Flow Wallet</h3>
                  <div className="flex items-center space-x-2 bg-neutral-50 p-3 rounded-lg">
                    <AiOutlineWallet className="text-neutral-600" />
                    <span className="text-sm font-mono text-neutral-600 break-all">
                      {user.flowWallet.address}
                    </span>
                  </div>
                </div>
              )}
              
              {user.medicalInfo && (
                <div className="space-y-6">
                  {user.medicalInfo.symptoms && user.medicalInfo.symptoms.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900">Symptoms</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.medicalInfo.symptoms.map((symptom) => (
                          <span
                            key={symptom}
                            className="px-3 py-1 bg-neutral-100 text-neutral-900 rounded-full text-sm"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.medicalInfo.treatments && user.medicalInfo.treatments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900">Treatments</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.medicalInfo.treatments.map((treatment) => (
                          <span
                            key={treatment}
                            className="px-3 py-1 bg-neutral-100 text-neutral-900 rounded-full text-sm"
                          >
                            {treatment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
