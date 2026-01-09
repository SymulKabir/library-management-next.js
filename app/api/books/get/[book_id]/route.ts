import { db } from "@/shared/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ book_id: string }> }
) {
  try {
    const { book_id } = await context.params;

    console.log("Received book_id:", book_id);

    if (!book_id) {
      return new Response(JSON.stringify({ error: "book_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const conn = await db();
    const [rows]: any = await conn.execute(
      "SELECT * FROM books WHERE book_id = ?",
      [book_id]
    );

    await conn.end();

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Book not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ data: rows[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in GET /api/books/get/[book_id]:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
