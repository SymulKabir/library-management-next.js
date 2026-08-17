import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_name, subcategory_name, description, subcategory_image } = body;

    if (!category_name || !subcategory_name) {
      return NextResponse.json({ success: false, error: "Category and subcategory names are required" }, { status: 400 });
    }

    const conn = await db();
    await conn.execute(
      "INSERT INTO book_subcategories (category_name, subcategory_name, description, subcategory_image) VALUES (?, ?, ?, ?)",
      [category_name, subcategory_name, description || "", subcategory_image || ""]
    );
    await conn.end();

    return NextResponse.json({ success: true, message: "Subcategory added successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding subcategory:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}