import { db } from "@/src/lib/db";
import { decodedToken } from "@/src/utils/token";

export const POST = async (request: Request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const { issue_id, amount, title, transactionId } = await request.json();
    console.log("issue_id, amount, title --->>", {
      issue_id,
      amount,
      title,
    });
    const conn = await db();

    const [rows] = await conn.execute(
      `
      SELECT 
        ir.issue_id, 
        ir.student_id,
        ir.status,
        irf.fine_amount,
        irf.fine_id,
        irfp.payment_id,
        irfp.status AS payment_status
      FROM issue_records AS ir 
      LEFT JOIN issue_record_fines AS irf 
        ON irf.issue_id = ir.issue_id 
      LEFT JOIN issue_record_fine_payments AS irfp 
        ON irfp.fine_id = irf.fine_id 
      WHERE ir.issue_id = ?
      `,
      [issue_id],
    );
    const record = rows[0];

    if (!record) {
      return Response.json(
        { message: "Issue record not fund" },
        { status: 200 },
      );
    }
    if (record.payment_status) {
      return Response.json(
        { message: "Payment already completed" },
        { status: 200 },
      );
    }
    const created = await conn.execute(
      "INSERT INTO issue_record_fine_payments (fine_id, amount_paid, transaction_id) VALUES (?, ?, ?)",
      [record.fine_id, Number(amount), transactionId],
    );
    console.log("created -->>", created)

    await conn.end();

    return Response.json({
      success: true,
      message: "Payment completed successfully",
    });
  } catch (error: any) {
    console.log("error -->>", error);
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
};
