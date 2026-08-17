import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_name, description, category_image } = body;

    if (!category_name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const conn = await db();
    await conn.execute(
      "INSERT INTO book_categories (category_name, description, category_image) VALUES (?, ?, ?)",
      [category_name, description || "", category_image || ""]
    );
    await conn.end();

    return NextResponse.json({ success: true, message: "Category added successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding category:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}