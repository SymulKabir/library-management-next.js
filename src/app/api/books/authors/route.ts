import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const author = body.author?.trim() || "";
    const page = Number(body.page || 1);
    const limit = Number(body.limit || 30);
    const offset = (page - 1) * limit;

    console.log("Author received --->>>", author);

    if (!author) {
      return NextResponse.json(
        { success: false, error: "Author name is required" },
        { status: 400 },
      );
    }

    const conn = await db();

    // Base query for fetching books by author
    let query = `
      SELECT 
        b.*,
        COUNT(i.book_id) AS total_issues
      FROM books b
      LEFT JOIN issue_records i ON b.book_id = i.book_id
      WHERE b.author = ?
      GROUP BY b.book_id
      ORDER BY b.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const params: any[] = [author];

    const [rows]: any = await conn.query(query, params);

    // Total count query for pagination
    const countQuery = "SELECT COUNT(DISTINCT b.book_id) as total FROM books b WHERE b.author = ?";
    const [countRows]: any = await conn.query(countQuery, [author]);
    
    const totalItems = countRows[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    await conn.end();

    return NextResponse.json(
      { success: true, data: rows, page, totalPages, totalItems },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching books by author API:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}