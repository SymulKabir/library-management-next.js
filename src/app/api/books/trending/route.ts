import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const search = body.search?.trim() || "";
    const category = body.category || "";
    const author = body.author || "";
    const sort = body.sort || "popular"; 
    const page = Number(body.page || 1);
    const limit = 30;
    const offset = (page - 1) * limit;

    const conn = await db();

    // Base query with JOIN to count issues
    let query = `
      SELECT 
        b.*,
        COUNT(i.book_id) AS total_issues
      FROM books b
      LEFT JOIN issue_records i ON b.book_id = i.book_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += " AND (b.title LIKE ? OR b.author LIKE ? OR b.book_id LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      query += " AND b.category = ?";
      params.push(category);
    }

    if (author) {
      query += " AND b.author = ?";
      params.push(author);
    }

    // Group by book to aggregate total issues properly
    query += " GROUP BY b.book_id";

    // Sorting: If trending/popular, order by issues descending, but fallback to RAND() for books with 0 issues
    if (sort === "popular" || sort === "trending") {
      query += " ORDER BY (total_issues > 0) DESC, total_issues DESC, RAND()";
    } else if (sort === "asc") {
      query += " ORDER BY b.created_at ASC";
    } else if (sort === "desc") {
      query += " ORDER BY b.created_at DESC";
    } else if (sort === "bestsale") {
      query += " ORDER BY b.stock DESC";
    }

    // Inject limit and offset safely
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows]: any = await conn.execute(query, params);

    // Total count query for pagination
    let countQuery = "SELECT COUNT(DISTINCT b.book_id) as total FROM books b LEFT JOIN issue_records i ON b.book_id = i.book_id WHERE 1=1";
    const countParams: any[] = [];

    if (search) {
      countQuery += " AND (b.title LIKE ? OR b.author LIKE ? OR b.book_id LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      countQuery += " AND b.category = ?";
      countParams.push(category);
    }
    if (author) {
      countQuery += " AND b.author = ?";
      countParams.push(author);
    }

    const [countRows]: any = await conn.execute(countQuery, countParams);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    await conn.end();

    return NextResponse.json(
      { data: rows, page, totalPages, totalItems },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching trending books API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}