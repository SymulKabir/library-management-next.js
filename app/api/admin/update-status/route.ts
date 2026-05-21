import { db } from "@/shared/lib/db";

const VALID_STATUSES = ["Approved", "Rejected", "Ban"];

export const PATCH = async (request: Request) => {
  try {
    const { admin_id, status } = await request.json();

    if (!admin_id || !status) {
      return Response.json(
        { success: false, message: "admin_id and status are required" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return Response.json(
        {
          success: false,
          message: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const conn = await db();

    // Check if admin exists
    const [rows] = await conn.execute(
      "SELECT admin_id FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    if ((rows as any[]).length === 0) {
      await conn.end();
      return Response.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    // Update admin status
    await conn.execute(
      "UPDATE admins SET status = ? WHERE admin_id = ?",
      [status, admin_id]
    );

    await conn.end();

    return Response.json({
      success: true,
      message: "Admin status updated successfully",
    });
  } catch (error: any) {
    console.error("Admin Update Error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
};
