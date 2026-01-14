import jwt from "jsonwebtoken";
import { db } from "@/shared/lib/db";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 401 }
      );
    }
    const conn = await db();
    const [students] = await conn.execute(
      "SELECT student_id, name, email, created_at FROM students WHERE student_id = ? and email = ?",
      [decoded.student_id, decoded.email]
    );
    await conn.end();

    const user = (students as any[])[0];
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ data: user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log("err ->", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
