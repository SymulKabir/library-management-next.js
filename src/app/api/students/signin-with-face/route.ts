import bcrypt from "bcryptjs";
import { db } from "@/src/lib/db";
import { generateToken } from "@/src/utils/token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { faceID} = body;

    if (!faceID) {
      return new Response(JSON.stringify({ message: "FaceID is required!" }), {
        status: 400,
      });
    }

    const conn = await db();
    const [students] = await conn.execute(
      "SELECT student_id, name, email, face_id, created_at FROM students WHERE face_id = ?",
      [faceID],
    );
    await conn.end();

    const user = (students as any[])[0];

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }
    // Return user data excluding password
    const { password: _, ...userData } = user;

    const token = generateToken({
      student_id: user.student_id,
      email: user.email,
    });
    return new Response(JSON.stringify({ data: userData, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error:any) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
