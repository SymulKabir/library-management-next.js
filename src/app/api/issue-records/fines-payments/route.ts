import { db } from "@/src/lib/db";
import { decodedToken } from "@/src/utils/token";

export const POST = async (request: Request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const { student_id } = decodedToken(authHeader);
    const { search, status } = await request.json();

    const conn = await db();
    
    // Changed to INNER JOIN for irf to exclude records without fines
    let query = `
      SELECT 
        ir.issue_id,
        ir.student_id,
        s.name AS student_name,
        ir.book_id,
        b.title AS book_title,
        ir.issue_date,
        ir.return_date,
        ir.status,
        irf.fine_amount,
        irf.fine_reason,
        irfp.status as payment_status
      FROM issue_records ir
      JOIN students s ON ir.student_id = s.student_id
      JOIN books b ON ir.book_id = b.book_id
      INNER JOIN issue_record_fines irf ON ir.issue_id = irf.issue_id
      LEFT JOIN issue_record_fine_payments irfp ON irf.fine_id = irfp.fine_id
      WHERE ir.student_id = ?
    `;

    const values: any[] = [student_id];

    if (search) {
      query += ` AND b.title LIKE ?`;
      values.push(`%${search}%`);
    }

    if (status) {
      query += ` AND ir.status = ?`;
      values.push(status);
    }

    const [records] = await conn.execute(query, values);
    await conn.end();

    return Response.json({ data: records });
  } catch (error: any) {
    return Response.json({ message: "Server error", error: error.message }, { status: 500 });
  }
};