import { db } from "@/src/lib/db";
import { decodedToken } from "@/src/utils/token";
import { NextResponse } from "next/server";

export async function GET(
  request: any,
  { params }: { params: Promise<Record<string, string>> },
) {
  const authHeader = request.headers.get("Authorization");
  const { student_id } = decodedToken(authHeader);
  let connection:  any | null = null;

  try {
    connection = await db();

    // 1. Fetch Student Details
    const [student] = await connection.execute(
      "SELECT name, email, department FROM students WHERE student_id = ?",
      [student_id],
    );

    // 2. Fetch Dashboard Stats (Counts)
    const [stats] = await connection.execute(
      `
      SELECT 
        (SELECT COUNT(*) FROM issue_records WHERE student_id = ? AND status = 'Issued') as issued_books,
        (SELECT COUNT(*) FROM books WHERE availability = TRUE) as available_books,
        (SELECT COUNT(*) FROM issue_records WHERE student_id = ? AND status = 'Pending') as pending_reservations
      FROM DUAL`,
      [student_id, student_id],
    );

    // 3. Fetch Recent Activity (Join issue_records with books)
    const [activity] = await connection.execute(
      `
      SELECT 
        ir.status, 
        ir.updated_at as date, 
        b.title 
      FROM issue_records ir
      JOIN books b ON ir.book_id = b.book_id
      WHERE ir.student_id = ?
      ORDER BY ir.updated_at DESC
      LIMIT 5`,
      [student_id],
    );
    const studentData = student as any[];
    const statsData = stats as any[];
    return NextResponse.json(
      {
        student: studentData[0],
        stats: statsData[0],
        activity: activity,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
