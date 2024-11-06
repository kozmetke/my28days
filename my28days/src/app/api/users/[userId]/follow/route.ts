import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/data";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = db.getUserByEmail(session.user.email!);
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const targetUser = db.getUserById(params.userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Can't follow yourself
    if (currentUser._id === targetUser._id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // For demo purposes, just toggle the follow status
    const isFollowing = currentUser.following.includes(targetUser._id);
    const updatedFollowing = isFollowing
      ? currentUser.following.filter(id => id !== targetUser._id)
      : [...currentUser.following, targetUser._id];

    // Return the updated following status
    return NextResponse.json({
      following: updatedFollowing,
      isFollowing: !isFollowing
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update follow status" },
      { status: 500 }
    );
  }
}
