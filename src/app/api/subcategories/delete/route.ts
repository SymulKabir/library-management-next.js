import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subcategory_id } = body;

    if (!subcategory_id) {
      return NextResponse.json({ success: false, error: "Subcategory ID is required" }, { status: 400 });
    }

    const conn = await db();
    await conn.execute("DELETE FROM book_subcategories WHERE subcategory_id = ?", [subcategory_id]);
    await conn.end();

    return NextResponse.json({ success: true, message: "Subcategory deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}