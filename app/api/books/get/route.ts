import { db } from "@/shared/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const search = body.search?.trim() || "";
    const category = body.category || "";
    const author = body.author || "";
    const sort = body.sort || "desc";
    const page = Number(body.page || 1);
    const limit = 30;
    const offset = (page - 1) * limit;

    const conn = await db();

    let query = "SELECT * FROM books WHERE 1=1";
    const params: any[] = [];

    if (search) {
      query += " AND (title LIKE ? OR author LIKE ? OR book_id LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (author) {
      query += " AND author = ?";
      params.push(author);
    }

    // Sorting
    if (sort === "asc") query += " ORDER BY created_at ASC";
    else if (sort === "desc") query += " ORDER BY created_at DESC";
    else if (sort === "bestsale") query += " ORDER BY stock DESC";

    // Inject limit and offset directly
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows]: any = await conn.execute(query, params);

    // Total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM books WHERE 1=1";
    const countParams: any[] = [];

    if (search) {
      countQuery += " AND (title LIKE ? OR author LIKE ? OR book_id LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      countQuery += " AND category = ?";
      countParams.push(category);
    }
    if (author) {
      countQuery += " AND author = ?";
      countParams.push(author);
    }

    const [countRows]: any = await conn.execute(countQuery, countParams);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    await conn.end();

    return new Response(
      JSON.stringify({ data: rows, page, totalPages, totalItems }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in POST /api/books/get:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
