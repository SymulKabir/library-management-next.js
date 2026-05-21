import { db } from "@/shared/lib/db";

export const POST = async (request: Request) => {
  try {
    const { search, status, sort } = await request.json();

    const conn = await db();

    let query = `
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
      WHERE 1=1
    `;

    const values: any[] = [];

    // search filter
    if (search) {
      query += ` AND (b.title LIKE ? OR s.name LIKE ?)`;
      values.push(`%${search}%`, `%${search}%`);
    }

    // status filter
    if (status) {
      query += ` AND ir.status = ?`;
      values.push(status);
    }

    // sort filter
    if (sort === "asc" || sort === "desc") {
      query += ` ORDER BY ir.issue_id ${sort.toUpperCase()}`;
    } else {
      query += ` ORDER BY ir.issue_id DESC`;
    }

    const [records] = await conn.execute(query, values);

    await conn.end();

    return Response.json({ data: records });
  } catch (error: any) {
    console.log("error ---->>>", error);
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};

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