import { db } from "@/shared/lib/db";
import { generateBookId } from "./utils/index";



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, category, availability, image_url, stock } = body;

    if (!title || !author || !category || !image_url || !stock) {
      return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
    }

    const book_id = generateBookId();

    const conn = await db();

    const [result]: any = await conn.execute(
      `INSERT INTO books (book_id, title, author, category, availability, image_url, stock) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [book_id, title, author, category, (availability || false), image_url, stock]
    );
    console.log("Insert Result:", result);
    await conn.end();

    return new Response(JSON.stringify({ data: { book_id: result.insertId, book_id } }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.log("error -3-->>", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
