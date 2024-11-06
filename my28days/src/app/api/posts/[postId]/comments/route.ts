import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/post';
import { createNotification } from '@/lib/notifications';

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comment = {
      user: session.user.id,
      content,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Create notification for the post author
    await createNotification({
      recipientId: post.author.toString(),
      senderId: session.user.id,
      type: 'comment',
      postId: postId,
      comment: content,
    });

    // Populate the user information for the new comment
    await post.populate('comments.user', 'name image');

    return NextResponse.json(post.comments[post.comments.length - 1]);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Error creating comment' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectDB();

    const post = await Post.findById(postId)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name image',
        },
        options: {
          sort: { createdAt: -1 },
          skip,
          limit,
        },
      });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const totalComments = post.comments.length;

    return NextResponse.json({
      comments: post.comments.slice(skip, skip + limit),
      hasMore: skip + limit < totalComments,
      total: totalComments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Error fetching comments' },
      { status: 500 }
    );
  }
}
