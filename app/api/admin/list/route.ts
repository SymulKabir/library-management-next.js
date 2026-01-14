import { db } from "@/shared/lib/db";

export const POST = async () => {
  try {
    const conn = await db();
    const [admins] = await conn.execute(
      "SELECT admin_id, name, email, role, status, created_at FROM admins"
    );
    await conn.end();

    return new Response(JSON.stringify({ data: admins }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
