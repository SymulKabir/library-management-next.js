import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vectorIDs = body.vector_ids;
    const match_from = body.match_from; 

    if (!vectorIDs || vectorIDs.length === 0) {
      return new Response(JSON.stringify({ error: "VectorIDs are required" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const conn = await db();
    const placeholders = vectorIDs.map(() => "?").join(","); 

    let query = `
      SELECT * 
      FROM books 
      WHERE ${match_from} IN (${placeholders})
    `;


    const [rows]: any = await conn.execute(query, vectorIDs);
    await conn.end(); 
    
    const sortedData = (
      await Promise.all(
        vectorIDs.map(async (vectorID: string) => {
          const item = rows.find((item: any) => item[match_from] === vectorID);
          return item;
        }),
      )
    ).filter((item: any) => item);

    return new Response(JSON.stringify({ data: sortedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error:any) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
