import { db } from "@/shared/lib/db";

export async function PUT(
  request: Request,
) {
  try {
    const body = await request.json();

    const { book_id, title, author, category, availability, image_url, stock } = body;

    if (!book_id) {
      return new Response(JSON.stringify({ message: "book_id is required." }), { status: 400 });
    }

    if (!title || !author || !category || !image_url || !stock) {
      return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
    }

    const conn = await db();

    const [result]: any = await conn.execute(
      `UPDATE books 
       SET title = ?, author = ?, category = ?, availability = ?, image_url = ?, stock = ?
       WHERE book_id = ?`,
      [title, author, category, availability ?? false, image_url, stock, book_id]
    );


    if (result.affectedRows === 0) {
      await conn.end();

      return new Response(JSON.stringify({ message: "Book not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const [data]: any = await conn.execute(`
      SELECT * FROM books WHERE book_id = ?`, [book_id]);
    await conn.end();
 

    return new Response(JSON.stringify({ message: "Book updated successfully.", data: data[0]}), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error updating book:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
