import { db } from "@/shared/lib/db";

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();
    const book_id = body.book_id;

    if (!book_id) {
      return new Response(JSON.stringify({ message: "book_id is required" }), {
        status: 400,
      });
    }

    const conn = await db();
    const [result]: any = await conn.execute(
      "DELETE FROM books WHERE book_id = ?",
      [book_id]
    );

    await conn.end();

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Book not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Book deleted successfully", success: true}), {
      status: 200,
    });
  } catch (error) {
    console.error("DELETE /api/books/delete", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
