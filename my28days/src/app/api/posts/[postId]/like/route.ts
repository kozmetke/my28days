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
    const userId = session.user.id;

    await connectDB();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
      // Create notification for the post author
      await createNotification({
        recipientId: post.author.toString(),
        senderId: userId,
        type: 'like',
        postId: postId,
      });
    }

    await post.save();

    return NextResponse.json({ likes: post.likes });
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json(
      { error: 'Error handling like' },
      { status: 500 }
    );
  }
}
