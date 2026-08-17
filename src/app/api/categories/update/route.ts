import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_id, category_name, description, category_image } = body;

    if (!category_id || !category_name) {
      return NextResponse.json({ success: false, error: "Category ID and name are required" }, { status: 400 });
    }

    const conn = await db();
    await conn.execute(
      "UPDATE book_categories SET category_name = ?, description = ?, category_image = ? WHERE category_id = ?",
      [category_name, description || "", category_image || "", category_id]
    );
    await conn.end();

    return NextResponse.json({ success: true, message: "Category updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}