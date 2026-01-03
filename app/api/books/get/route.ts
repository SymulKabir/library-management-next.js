import { db } from "@/shared/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = body.category || "";
    const author = body.author || "";
    const sort = body.sort || "";
    const page = Number(body.page || 1);
    const limit = 30;
    const offset = (page - 1) * limit;

    const conn = await db();

    let query = "SELECT * FROM books WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (author) {
      query += " AND author = ?";
      params.push(author);
    }

    if (sort === "asc") query += " ORDER BY created_at ASC";
    if (sort === "desc") query += " ORDER BY created_at DESC";
    if (sort === "bestsale") query += " ORDER BY stock DESC";

    // Inject limit and offset directly
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows]: any = await conn.execute(query, params);

    await conn.end();

    return new Response(JSON.stringify({ data: rows, page }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /api/books/get:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
