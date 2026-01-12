import { db } from "@/shared/lib/db";

export const GET = async () => {
  try {
    const conn = await db();

    const [records] = await conn.execute(`
      SELECT 
        ir.issue_id,
        ir.student_id,
        s.name AS student_name,
        ir.book_id,
        b.title AS book_title,
        ir.issue_date,
        ir.return_date,
        ir.status
      FROM issue_records ir
      JOIN students s ON ir.student_id = s.student_id
      JOIN books b ON ir.book_id = b.book_id
      ORDER BY ir.issue_id DESC
    `);

    await conn.end();
    console.log("Fetched Records:", records);
    return Response.json({ data: records });
  } catch (error: any) {
    console.log("error ---->>>", error);
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};
