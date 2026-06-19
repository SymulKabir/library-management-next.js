import { db } from "@/src/lib/db";
import { decodedToken } from "@/src/utils/token";

const VALID_STATUSES = ["Pending", "Issued", "Rejected", "Returned", "Fine"];

export const PATCH = async (request: Request) => {
  let conn;
  try {
    const authHeader = request.headers.get("Authorization");
    const { admin_id } = decodedToken(authHeader);
    console.log("admin_id -->>", admin_id)
    const body = await request.json();
    const { issue_id, status, fineAmount, fineReason, fineNotes } = body;
    console.log("body --->>", body);

    // 1. Basic validation
    if (!issue_id || !status) {
      return Response.json(
        { success: false, message: "Required fields missing" },
        { status: 400 },
      );
    }

    // 2. Fine validation: fineAmount is mandatory, fineReason is optional
    if (
      status === "Fine" &&
      (fineAmount === undefined || fineAmount === null || fineAmount === "")
    ) {
      return Response.json(
        {
          success: false,
          message: "Fine amount is required when status is set to Fine",
        },
        { status: 400 },
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return Response.json(
        {
          success: false,
          message: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    conn = await db();

    // 3. Find existing issue record
    const [record] = await conn.execute(
      "SELECT issue_id, book_id, status FROM issue_records WHERE issue_id = ?",
      [issue_id],
    );

    if ((record as any[]).length === 0) {
      return Response.json(
        { success: false, message: "Issue record not found" },
        { status: 404 },
      );
    }

    const issueRecord = (record as any[])[0];

    // 4. Update stock based on status change (Fixed to match capitalized VALID_STATUSES)
    if (issueRecord.status !== status) {
      if (status === "Issued") {
        // Decrease stock when issuing
        await conn.execute(
          "UPDATE books SET stock = stock - 1 WHERE book_id = ? AND stock > 0",
          [issueRecord.book_id],
        );
      } else if (status === "Rejected" || status === "Returned") {
        // Increase stock when rejected or returned
        await conn.execute(
          "UPDATE books SET stock = stock + 1 WHERE book_id = ?",
          [issueRecord.book_id],
        );
      }
    }

    // 5. If status is "Fine", create/insert fine record
    if (status === "Fine") {
      await conn.execute(
        `INSERT INTO issue_record_fines 
          (issue_id, admin_id, fine_amount, fine_reason, fine_notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          issue_id,
          admin_id,
          fineAmount,
          fineReason || "No reason specified",
          fineNotes || null,
        ],
      );
    }

    // 6. Update main record status
    await conn.execute(
      "UPDATE issue_records SET status = ?, admin_id = ? WHERE issue_id = ?",
      [status, admin_id, issue_id],
    );

    return Response.json({
      success: true,
      message:
        status === "Fine"
          ? "Fine applied and status updated successfully"
          : "Status updated successfully",
    });
  } catch (error: any) {
    console.log("error -->", error)
    return Response.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  } finally {
    // Safely close the connection no matter what happens
    if (conn) {
      await conn.end();
    }
  }
};
