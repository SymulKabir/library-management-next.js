import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

// GET: Fetch all subcategories
export async function GET() {
  try {
    const conn = await db();
    const [rows] = await conn.execute("SELECT * FROM book_subcategories ORDER BY subcategory_id DESC");
    await conn.end();

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a new subcategory
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_name, subcategory_name, description } = body;

    if (!category_name || !subcategory_name) {
      return NextResponse.json({ success: false, error: "Category and Subcategory names are required" }, { status: 400 });
    }

    const conn = await db();
    await conn.execute(
      "INSERT INTO book_subcategories (category_name, subcategory_name, description) VALUES (?, ?, ?)",
      [category_name, subcategory_name, description || ""]
    );
    await conn.end();

    return NextResponse.json({ success: true, message: "Subcategory added successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding subcategory:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}