import { db } from "@/shared/lib/db";

const VALID_STATUSES = ["Pending", "Issued", "Rejected", "Returned"];

export const PATCH = async (request: Request) => {
  try {
    const { issue_id, status } = await request.json();

    if (!issue_id || !status) {
      return Response.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return Response.json(
        { success: false, message: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const conn = await db();

    const [record] = await conn.execute(
      "SELECT issue_id, book_id, status FROM issue_records WHERE issue_id = ?",
      [issue_id]
    );

    if ((record as any[]).length === 0) {
      await conn.end();
      return Response.json({ success: false, message: "Issue record not found" }, { status: 404 });
    }

    const issueRecord = (record as any[])[0];

    // Update stock based on status change
    if (issueRecord.status !== status) {
      if (status === "issued") {
        // Decrease stock when issuing
        await conn.execute(
          "UPDATE books SET stock = stock - 1 WHERE book_id = ? AND stock > 0",
          [issueRecord.book_id]
        );
      } else if (status === "rejected" || status === "returned") {
        // Increase stock when rejected or returned
        await conn.execute(
          "UPDATE books SET stock = stock + 1 WHERE book_id = ?",
          [issueRecord.book_id]
        );
      }
    }

    // Update status
    await conn.execute(
      "UPDATE issue_records SET status = ? WHERE issue_id = ?",
      [status, issue_id]
    );

    await conn.end();

    return Response.json({ success: true, message: "Status updated successfully" });
  } catch (error: any) {
    console.log("error ---->>>", error);
    return Response.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
