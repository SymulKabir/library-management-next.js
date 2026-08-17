import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function GET() {
  try {
    const conn = await db();
    
    // Query that joins book_categories with books and counts the books per category
    const query = `
      SELECT 
        c.category_id, 
        c.category_name, 
        c.category_image, 
        c.description, 
        c.created_at, 
        c.updated_at,
        COUNT(b.book_id) AS total_books
      FROM book_categories c
      LEFT JOIN books b ON c.category_name = b.category
      GROUP BY c.category_id
      ORDER BY c.category_id DESC;
    `;

    const [rows] = await conn.execute(query);
    await conn.end();

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching categories with book counts:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}