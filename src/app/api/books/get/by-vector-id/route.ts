import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const vectorIDs = body.vector_ids;
    if (!vectorIDs || vectorIDs.length === 0) {
      return new Response(JSON.stringify({ error: "VectorIDs are required" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const conn = await db();
    const placeholders = vectorIDs.map(() => "?").join(",");

    const query = `
      SELECT * 
      FROM books 
      WHERE vector_id IN (${placeholders})
    `;

    const [rows]: any = await conn.execute(query, vectorIDs);
    await conn.end();

    const sortedData = (
      await Promise.all(
        vectorIDs.map(async (vectorID: string) => {
          const item = rows.find((item: any) => item.vector_id === vectorID);
          return item;
        }),
      )
    ).filter((item: any) => item);

    return new Response(JSON.stringify({ data: sortedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
