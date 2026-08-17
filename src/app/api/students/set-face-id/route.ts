import bcrypt from "bcryptjs";
import { db } from "@/src/lib/db";
import { generateToken } from "@/src/utils/token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { faceID, studentID } = body;

    if (!faceID || !studentID) {
      return new Response(
        JSON.stringify({ message: "FaceID and studentID are required!" }),
        {
          status: 400,
        },
      );
    }

    const conn = await db();
    const [faceStudent] = await conn.execute(
      "SELECT student_id, name, email, face_id, created_at FROM students WHERE face_id = ?",
      [faceID],
    ); 

    const checkUser = (faceStudent as any[])[0];
    if (checkUser) {
await conn.end();

      return new Response(
        JSON.stringify({
          message: "This face already authenticate with another account!",
        }),
        {
          status: 400,
        },
      );
    } 

    await conn.execute(
      "UPDATE students SET face_id = ? WHERE student_id = ?",
      [faceID, studentID],
    );
    const [student] = await conn.execute(
      "SELECT student_id, name, email, face_id, created_at FROM students WHERE student_id = ?",
      [studentID],
    );
    await conn.end();

    const user = (student as any[])[0];
    // Return user data excluding password
    const { password: _, ...userData } = user;
 
    return new Response(JSON.stringify({ data: userData }), {
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
