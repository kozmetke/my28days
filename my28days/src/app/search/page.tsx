'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters, AiOutlineSearch } from 'react-icons/ai';
import PostCard from '@/components/posts/PostCard';
import UserCard from '@/components/users/UserCard';

const categories = [
  'Discussion',
  'Question',
  'Experience',
  'Support',
  'Resource',
];

export default function Search() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchType, setSearchType] = useState<'posts' | 'users'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const query = searchParams.get('q');
    const type = searchParams.get('type') as 'posts' | 'users';
    const category = searchParams.get('category');

    if (query) setSearchQuery(query);
    if (type) setSearchType(type);
    if (category) setSelectedCategory(category);

    if (query || type || category) {
      performSearch(true);
    }
  }, [searchParams]);

  const performSearch = async (reset = false) => {
    if (reset) {
      setPage(1);
      setResults([]);
    }

    setLoading(true);

    try {
      const currentPage = reset ? 1 : page;
      const params = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        page: currentPage.toString(),
        limit: '10',
      });

      if (selectedCategory && searchType === 'posts') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        setResults(prev => reset ? data.results : [...prev, ...data.results]);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    params.set('type', searchType);
    if (selectedCategory && searchType === 'posts') {
      params.set('category', selectedCategory);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (hasMore && !loading) {
        setPage(prev => prev + 1);
        performSearch();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
                <AiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Search
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setSearchType('posts')}
                className={`px-4 py-2 rounded-md ${
                  searchType === 'posts'
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Posts
              </button>
              <button
                type="button"
                onClick={() => setSearchType('users')}
                className={`px-4 py-2 rounded-md ${
                  searchType === 'users'
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Users
              </button>
            </div>

            {searchType === 'posts' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {results.length === 0 && !loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600">No results found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              searchType === 'posts' ? (
                <PostCard
                  key={result._id}
                  post={result}
                  currentUserId={session?.user?.id}
                />
              ) : (
                <UserCard key={result._id} user={result} />
              )
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin text-pink-600" />
          </div>
        )}
      </div>
    </div>
  );
}
