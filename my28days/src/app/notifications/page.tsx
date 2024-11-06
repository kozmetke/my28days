'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineLoading3Quarters, AiOutlineDelete } from 'react-icons/ai';

interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow';
  sender: {
    _id: string;
    name: string;
    image: string;
  };
  post?: {
    _id: string;
    content: string;
  };
  comment?: string;
  createdAt: string;
  read: boolean;
}

export default function Notifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [clearingAll, setClearingAll] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?page=${page}&limit=20`);
        const data = await response.json();

        if (response.ok && mounted) {
          if (page === 1) {
            setNotifications(data.notifications || []);
          } else {
            setNotifications(prev => [...prev, ...(data.notifications || [])]);
          }
          setHasMore(data.hasMore || false);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      mounted = false;
    };
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const clearAllNotifications = async () => {
    if (!confirm('Are you sure you want to clear all notifications?')) return;

    setClearingAll(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    } finally {
      setClearingAll(false);
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen border-x border-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 border-b border-neutral-100">
        <div className="px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900">Notifications</h1>
          {notifications?.length > 0 && (
            <button
              onClick={clearAllNotifications}
              disabled={clearingAll}
              className="flex items-center text-sm text-neutral-600 hover:text-red-600"
            >
              {clearingAll ? (
                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-1" />
              ) : (
                <AiOutlineDelete className="h-4 w-4 mr-1" />
              )}
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading && notifications.length === 0 ? (
        <div className="flex justify-center py-8">
          <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-neutral-500" />
        </div>
      ) : notifications?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-600">No notifications yet</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {notifications?.map((notification) => (
            <div
              key={notification._id}
              className={`px-4 py-3 ${
                !notification.read && 'bg-neutral-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Link href={`/profile/${notification.sender._id}`}>
                  <Image
                    src={notification.sender.image}
                    alt={notification.sender.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/profile/${notification.sender._id}`}
                        className="font-semibold text-sm text-neutral-900 hover:underline"
                      >
                        {notification.sender.name}
                      </Link>{' '}
                      <span className="text-sm text-neutral-600">
                        {getNotificationText(notification)}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {notification.post && (
                    <Link
                      href={`/posts/${notification.post._id}`}
                      className="mt-1 block text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      {notification.post.content.length > 100
                        ? `${notification.post.content.substring(0, 100)}...`
                        : notification.post.content}
                    </Link>
                  )}
                  {notification.comment && (
                    <p className="mt-1 text-sm text-neutral-600">
                      "{notification.comment}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-center py-8">
              <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin text-neutral-500" />
            </div>
          )}
        </div>
      )}

      {/* Bottom Padding for Mobile Navigation */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
