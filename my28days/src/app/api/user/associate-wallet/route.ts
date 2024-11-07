import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createFlowAccount } from "@/lib/flow";
import { db } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user already has a wallet
    const user = db.getUserById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.flowWallet?.address) {
      return NextResponse.json(
        { error: "User already has a Flow wallet associated" },
        { status: 400 }
      );
    }

    // Create new Flow wallet
    const flowAccount = await createFlowAccount();

    // Update user with wallet details
    db.updateUserWallet(session.user.id, flowAccount);

    return NextResponse.json({
      message: "Flow wallet successfully associated",
      data: {
        address: flowAccount.address,
        publicKey: flowAccount.publicKey
      }
    });
  } catch (error: any) {
    console.error("Error associating Flow wallet:", error);
    return NextResponse.json(
      { error: error.message || "Failed to associate Flow wallet" },
      { status: 500 }
    );
  }
}
