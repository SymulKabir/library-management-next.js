import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_id } = body;

    if (!category_id) {
      return NextResponse.json({ success: false, error: "Category ID is required" }, { status: 400 });
    }

    const conn = await db();
    await conn.execute("DELETE FROM book_categories WHERE category_id = ?", [category_id]);
    await conn.end();

    return NextResponse.json({ success: true, message: "Category deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}