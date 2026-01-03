import { db } from "@/shared/lib/db";

export async function GET(request: Request) {
  try {
    const conn = await db();

    // 2) Fetch unique categories
    const [categories]: any = await conn.execute(
      "SELECT DISTINCT category FROM books"
    );
    console.log("categories ---->>>", categories);

    // 3) Fetch unique authors
    const [authors]: any = await conn.execute(
      "SELECT DISTINCT author FROM books"
    );

    await conn.end();

    return new Response(
      JSON.stringify({
        data: {
          categories: categories.map((c: any) => c.category),
          authors: authors.map((a: any) => a.author),
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error GET /api/books:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
