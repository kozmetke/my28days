import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { Post, Comment } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const allPosts = db.getPosts();
    const start = (page - 1) * limit;
    const end = start + limit;
    const posts = allPosts.slice(start, end);

    // Transform posts to match the expected format
    const transformedPosts = posts.map(post => {
      const user = db.getUserById(post.userId);
      if (!user) {
        throw new Error(`User not found for post ${post._id}`);
      }

      const transformedPost: Post = {
        _id: post._id,
        content: post.content,
        author: {
          _id: user._id,
          name: user.name,
          image: user.image || '',
        },
        userId: post.userId,
        images: [],
        likes: post.likes,
        comments: post.comments.map(comment => {
          const commentUser = db.getUserById(comment.userId);
          if (!commentUser) {
            throw new Error(`User not found for comment ${comment._id}`);
          }
          const transformedComment: Comment = {
            _id: comment._id,
            postId: comment.postId,
            userId: comment.userId,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            user: {
              _id: commentUser._id,
              name: commentUser.name,
              image: commentUser.image || '',
            }
          };
          return transformedComment;
        }),
        category: 'general',
        isAnonymous: false,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      };

      return transformedPost;
    });

    return NextResponse.json({
      posts: transformedPosts,
      hasMore: end < allPosts.length
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { content } = data;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const user = db.getUserByEmail(session.user.email!);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const post: Post = {
      _id: Math.random().toString(36).substr(2, 9),
      userId: user._id,
      content,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        _id: user._id,
        name: user.name,
        image: user.image || '',
      },
      category: 'general',
      isAnonymous: false,
      images: []
    };

    // In a real app, we would save this to the database
    // For now, we'll just return the created post
    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
