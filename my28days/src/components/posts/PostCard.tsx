'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    image: string;
  };
  createdAt: string;
}

interface PostCardProps {
  post: {
    _id: string;
    content: string;
    author: {
      _id: string;
      name: string;
      image: string;
    };
    images?: string[];
    likes: string[];
    comments: Comment[];
    category: string;
    isAnonymous: boolean;
    createdAt: string;
  };
  currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId || ''));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const fetchComments = async () => {
    if (!showComments || loading || (!hasMore && page !== 1)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${post._id}/comments?page=${page}&limit=5`);
      const data = await response.json();

      if (response.ok) {
        if (page === 1) {
          setComments(data.comments);
        } else {
          setComments(prev => [...prev, ...data.comments]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowComments = () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);
    if (newShowComments && comments.length === 0) {
      fetchComments();
    }
  };

  const handleLoadMoreComments = () => {
    setPage(prev => prev + 1);
    fetchComments();
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment('');
        // Reset page and hasMore to ensure proper pagination after new comment
        setPage(1);
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-start space-x-3">
        <Link href={`/profile/${post.author._id}`}>
          {post.isAnonymous ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500">A</span>
            </div>
          ) : (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
        </Link>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link href={`/profile/${post.author._id}`}>
              <span className="font-medium text-gray-900">
                {post.isAnonymous ? 'Anonymous' : post.author.name}
              </span>
            </Link>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs font-medium text-pink-600 bg-pink-50 rounded-full mb-2">
              {post.category}
            </span>
            <p className="text-gray-900">{post.content}</p>
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mt-3 grid gap-2 grid-cols-2">
              {post.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-pink-600"
            >
              {isLiked ? (
                <AiFillHeart className="w-5 h-5 text-pink-600" />
              ) : (
                <AiOutlineHeart className="w-5 h-5" />
              )}
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleShowComments}
              className="flex items-center space-x-1 text-gray-500 hover:text-pink-600"
            >
              <AiOutlineMessage className="w-5 h-5" />
              <span>{comments.length || post.comments.length}</span>
            </button>
          </div>

          {showComments && (
            <div className="mt-4 space-y-4">
              <form onSubmit={handleSubmitComment} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                  ) : (
                    'Post'
                  )}
                </button>
              </form>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <Link href={`/profile/${comment.user._id}`}>
                      <Image
                        src={comment.user.image}
                        alt={comment.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </Link>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/profile/${comment.user._id}`}>
                          <span className="font-medium text-gray-900">
                            {comment.user.name}
                          </span>
                        </Link>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <button
                    onClick={handleLoadMoreComments}
                    disabled={loading}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'Load more comments'
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
