'use client';

import { useState, useEffect } from 'react';
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
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUserId || ''));
    setLikesCount(post.likes.length);
  }, [post.likes, currentUserId]);

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
  };

  useEffect(() => {
    let mounted = true;

    if (page > 1 && showComments) {
      const loadMoreComments = async () => {
        try {
          const response = await fetch(`/api/posts/${post._id}/comments?page=${page}&limit=5`);
          const data = await response.json();

          if (response.ok && mounted) {
            setComments(prev => [...prev, ...data.comments]);
            setHasMore(data.hasMore);
          }
        } catch (error) {
          console.error('Error loading more comments:', error);
        }
      };

      loadMoreComments();
    }

    return () => {
      mounted = false;
    };
  }, [page, post._id, showComments]);

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
    <div className="py-3 border-b border-neutral-100">
      <div className="flex items-start space-x-3">
        <Link href={`/profile/${post.author._id}`}>
          {post.isAnonymous ? (
            <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center">
              <span className="text-neutral-500">A</span>
            </div>
          ) : (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={36}
              height={36}
              className="rounded-full"
            />
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <Link href={`/profile/${post.author._id}`}>
              <span className="font-semibold text-sm text-neutral-900 hover:underline">
                {post.isAnonymous ? 'Anonymous' : post.author.name}
              </span>
            </Link>
            <span className="text-xs text-neutral-500">·</span>
            <span className="text-xs text-neutral-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="mt-1">
            <span className="text-xs text-neutral-500">
              {post.category}
            </span>
            <p className="text-[15px] text-neutral-900 whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mt-2 grid gap-0.5 grid-cols-2">
              {post.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  width={300}
                  height={300}
                  className="rounded object-cover w-full h-48"
                />
              ))}
            </div>
          )}

          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-neutral-500 hover:text-neutral-900"
            >
              {isLiked ? (
                <AiFillHeart className="w-4 h-4 text-red-500" />
              ) : (
                <AiOutlineHeart className="w-4 h-4" />
              )}
              <span className="text-xs">{likesCount}</span>
            </button>

            <button
              onClick={handleShowComments}
              className="flex items-center space-x-1 text-neutral-500 hover:text-neutral-900"
            >
              <AiOutlineMessage className="w-4 h-4" />
              <span className="text-xs">{comments.length || post.comments.length}</span>
            </button>
          </div>

          {showComments && (
            <div className="mt-3 space-y-3">
              <form onSubmit={handleSubmitComment} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-1.5 text-sm bg-neutral-100 rounded-full focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-1.5 text-sm bg-neutral-900 text-white rounded-full hover:bg-neutral-800 disabled:opacity-50 disabled:hover:bg-neutral-900"
                >
                  {submitting ? (
                    <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                  ) : (
                    'Reply'
                  )}
                </button>
              </form>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-2">
                    <Link href={`/profile/${comment.user._id}`}>
                      <Image
                        src={comment.user.image}
                        alt={comment.user.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <Link href={`/profile/${comment.user._id}`}>
                          <span className="text-sm font-semibold text-neutral-900 hover:underline">
                            {comment.user.name}
                          </span>
                        </Link>
                        <span className="text-xs text-neutral-500">·</span>
                        <span className="text-xs text-neutral-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-900 mt-0.5">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <button
                    onClick={handleLoadMoreComments}
                    disabled={loading}
                    className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-900"
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      'Show more replies'
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
