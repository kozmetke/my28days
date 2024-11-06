import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all";

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    let results: any = {};

    if (type === "all" || type === "posts") {
      results.posts = db.searchPosts(query);
    }

    if (type === "all" || type === "users") {
      results.users = db.searchUsers(query);
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
