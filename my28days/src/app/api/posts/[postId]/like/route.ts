import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/data";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = db.getUserByEmail(session.user.email!);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const post = db.getPostById(params.postId);
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // For demo purposes, just toggle the like status
    const isLiked = post.likes.includes(user._id);
    const updatedLikes = isLiked
      ? post.likes.filter(id => id !== user._id)
      : [...post.likes, user._id];

    // Return the updated likes array
    return NextResponse.json({ likes: updatedLikes });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
}
