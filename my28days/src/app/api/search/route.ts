import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/post';
import User from '@/models/user';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'posts';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectDB();

    if (type === 'users') {
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
        ],
      })
        .select('-password')
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
        ],
      });

      return NextResponse.json({
        results: users,
        hasMore: skip + users.length < total,
      });
    } else {
      const postQuery: any = {
        $or: [
          { content: { $regex: query, $options: 'i' } },
        ],
      };

      if (category) {
        postQuery.category = category;
      }

      const posts = await Post.find(postQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name image')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'name',
          },
        });

      const total = await Post.countDocuments(postQuery);

      return NextResponse.json({
        results: posts,
        hasMore: skip + posts.length < total,
      });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error performing search' },
      { status: 500 }
    );
  }
}
