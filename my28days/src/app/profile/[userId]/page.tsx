'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { AiOutlineLoading3Quarters, AiOutlineCalendar } from 'react-icons/ai';
import PostCard from '@/components/posts/PostCard';
import { format } from 'date-fns';
import type { User, Post } from '@/types';

export default function Profile({ params }: { params: { userId: string } }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  const isCurrentUser = session?.user?.id === params.userId;
  const isFollowing = user?.followers.includes(session?.user?.id || '');

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [params.userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${params.userId}`);
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
      const response = await fetch(`/api/users/${params.userId}/posts`);
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
      const response = await fetch(`/api/users/${params.userId}/follow`, {
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
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <Image
                src={user.image}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    {user.bio && (
                      <p className="mt-1 text-gray-600">{user.bio}</p>
                    )}
                  </div>
                  {!isCurrentUser && (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-4 py-2 rounded-md ${
                        isFollowing
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-pink-600 text-white hover:bg-pink-700'
                      }`}
                    >
                      {followLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                      ) : (
                        isFollowing ? 'Following' : 'Follow'
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
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

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`pb-4 ${
                    activeTab === 'posts'
                      ? 'border-b-2 border-pink-500 text-pink-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`pb-4 ${
                    activeTab === 'about'
                      ? 'border-b-2 border-pink-500 text-pink-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  About
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'posts' ? (
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-pink-600" />
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                  <p className="text-gray-600">No posts yet</p>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {user.medicalInfo && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Symptoms</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.medicalInfo.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Treatments</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.medicalInfo.treatments.map((treatment) => (
                        <span
                          key={treatment}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {treatment}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
