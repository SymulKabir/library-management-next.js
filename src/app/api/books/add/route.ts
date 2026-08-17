import { db } from "@/src/lib/db";
import { generateBookId } from "@/src/utils/book";
// import { ML_BACKEND_URL } from "@/src/constants";
import { createBookMetadataVector, createBookVector } from "@/src/services/book";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, category, availability, image_url, stock } = body;

    const { image_vector_id } = await createBookVector(image_url);
    const { metadata_vector_id } = await createBookMetadataVector({title, author, category });

    if (!image_vector_id) {
      return new Response(
        JSON.stringify({ error: "Failed to generate vector item" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!title || !author || !category || !image_url || !stock) {
      return new Response(
        JSON.stringify({ message: "All fields are required." }),
        { status: 400 },
      );
    }

    const book_id = generateBookId();

    const conn = await db();

    const [result]: any = await conn.execute(
      `INSERT INTO books (book_id, title, author, category, availability, image_url, image_vector_id, metadata_vector_id, stock) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        book_id,
        title,
        author,
        category,
        availability || false,
        image_url,
        image_vector_id,
        metadata_vector_id,
        stock,
      ],
    );
    await conn.end();

    return new Response(
      JSON.stringify({ data: { book_id: result.insertId } }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error:any) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
