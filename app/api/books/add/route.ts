import { db } from "@/shared/lib/db";
import { generateBookId } from "./utils/index";

 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, isbn, category, image_url, stock } = body;

    if (!title || !author || !isbn || !category || !image_url || !stock) {
      return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
    }

    const id = generateBookId();

    const conn = await db();

    const [result]: any = await conn.execute(
      `INSERT INTO books (id, title, author, isbn, category, image_url, stock, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, title, author, isbn, category, image_url, stock]
    );

    await conn.end();

    return new Response(JSON.stringify({ data: { id: result.insertId, id } }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    console.log("error --->>", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
