import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/data";

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    const { params } = context;
    const user = db.getUserById(params.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user without sensitive information
    const { email, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    const { params } = context;
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = db.getUserByEmail(session.user.email!);
    if (!currentUser || currentUser._id !== params.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { name, bio, medicalInfo } = data;

    // For demo purposes, just return the updated data
    // In a real app, this would update the user in the database
    return NextResponse.json({
      ...currentUser,
      name: name || currentUser.name,
      bio: bio || currentUser.bio,
      medicalInfo: medicalInfo || currentUser.medicalInfo
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
