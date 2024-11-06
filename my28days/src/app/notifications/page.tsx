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
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?page=${page}&limit=20`);
      const data = await response.json();

      if (response.ok) {
        if (page === 1) {
          setNotifications(data.notifications);
        } else {
          setNotifications(prev => [...prev, ...data.notifications]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (hasMore && !loading) {
        setPage(prev => prev + 1);
        fetchNotifications();
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
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              disabled={clearingAll}
              className="flex items-center text-sm text-gray-600 hover:text-red-600"
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

      {loading && notifications.length === 0 ? (
        <div className="flex justify-center py-8">
          <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-pink-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-600">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white p-4 rounded-lg shadow-sm border ${
                notification.read ? 'border-gray-200' : 'border-pink-200 bg-pink-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Link href={`/profile/${notification.sender._id}`}>
                  <Image
                    src={notification.sender.image}
                    alt={notification.sender.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/profile/${notification.sender._id}`}
                        className="font-medium text-gray-900 hover:text-pink-600"
                      >
                        {notification.sender.name}
                      </Link>{' '}
                      <span className="text-gray-600">
                        {getNotificationText(notification)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {notification.post && (
                    <Link
                      href={`/posts/${notification.post._id}`}
                      className="mt-2 block text-sm text-gray-600 hover:text-gray-900"
                    >
                      {notification.post.content.length > 100
                        ? `${notification.post.content.substring(0, 100)}...`
                        : notification.post.content}
                    </Link>
                  )}
                  {notification.comment && (
                    <p className="mt-2 text-sm text-gray-600">
                      "{notification.comment}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-center py-4">
              <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin text-pink-600" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
