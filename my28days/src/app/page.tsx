'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PostCard from '@/components/posts/PostCard';
import DoctorCarousel from '@/components/doctors/DoctorCarousel';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import type { Post } from '@/types';

// Dummy doctor data
const doctors = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: '/woman-avatar.svg',
    specialty: 'Gynecologist & Menopause Specialist',
    qualifications: ['MBBS', 'MD', 'NAMS Certified'],
    rating: 4.9,
    yearsOfExperience: 15
  },
  {
    id: '2',
    name: 'Emily Chen',
    image: '/woman-avatar.svg',
    specialty: 'Endocrinologist',
    qualifications: ['MD', 'PhD', 'Board Certified'],
    rating: 4.8,
    yearsOfExperience: 12
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    image: '/woman-avatar.svg',
    specialty: 'Women\'s Health Specialist',
    qualifications: ['MBBS', 'MRCOG', 'Menopause Expert'],
    rating: 4.9,
    yearsOfExperience: 18
  },
  {
    id: '4',
    name: 'Lisa Thompson',
    image: '/woman-avatar.svg',
    specialty: 'Reproductive Health Specialist',
    qualifications: ['MD', 'FACOG', 'Menopause Certified'],
    rating: 4.7,
    yearsOfExperience: 14
  },
  {
    id: '5',
    name: 'Rachel Kim',
    image: '/woman-avatar.svg',
    specialty: 'Hormone Specialist',
    qualifications: ['MD', 'PhD', 'Endocrinology'],
    rating: 4.8,
    yearsOfExperience: 16
  }
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    let mounted = true;

    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?page=${page}&limit=10`);
        const data = await response.json();

        if (response.ok && mounted) {
          if (page === 1) {
            setPosts(data.posts);
          } else {
            setPosts(prev => [...prev, ...data.posts]);
          }
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchPosts();
    }

    return () => {
      mounted = false;
    };
  }, [status, page]);

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

  if (status === 'loading' || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen border-x border-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 border-b border-neutral-100">
        <div className="px-4 h-14 flex items-center">
          <h1 className="text-xl font-semibold text-neutral-900">Home</h1>
        </div>
      </div>

      {/* Pinned Doctors */}
      <div className="border-b border-neutral-100">
        <div className="px-4 py-3">
          <h2 className="text-sm font-medium text-neutral-500">Recommended Specialists</h2>
        </div>
        <DoctorCarousel doctors={doctors} />
      </div>

      {/* Posts */}
      <div className="divide-y divide-neutral-100">
        {posts?.length === 0 && !loading ? (
          <div className="text-center py-8">
            <p className="text-neutral-600">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts?.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={session.user.id}
            />
          ))
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin text-neutral-500" />
          </div>
        )}
      </div>

      {/* Bottom Padding for Mobile Navigation */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
