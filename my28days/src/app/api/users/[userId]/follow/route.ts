import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import { createNotification } from '@/lib/notifications';

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;
    const currentUserId = session.user.id;

    if (userId === currentUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    await connectDB();

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id: string) => id.toString() !== userId
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id: string) => id.toString() !== currentUserId
      );
    } else {
      // Follow
      currentUser.following.push(userId);
      userToFollow.followers.push(currentUserId);
      
      // Create notification
      await createNotification({
        recipientId: userId,
        senderId: currentUserId,
        type: 'follow',
      });
    }

    await Promise.all([
      currentUser.save(),
      userToFollow.save(),
    ]);

    return NextResponse.json({
      isFollowing: !isFollowing,
      followersCount: userToFollow.followers.length,
      followingCount: userToFollow.following.length,
    });
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json(
      { error: 'Error processing follow request' },
      { status: 500 }
    );
  }
}
