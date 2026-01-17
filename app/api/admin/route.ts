import bcrypt from "bcryptjs";
import { db } from "@/shared/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, password, confirmPassword } = body;

    if (!name || !email || !role || !password || !confirmPassword) {
      return new Response(
        JSON.stringify({ message: "All fields are required." }),
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({ message: "Passwords do not match." }),
        { status: 400 }
      );
    }

    const conn = await db();


    const [existingEmail] = await conn.execute(
      "SELECT admin_id FROM admins WHERE email = ?",
      [email]
    );
    if ((existingEmail as any[]).length > 0) {
      await conn.end();
      return new Response(
        JSON.stringify({ message: "Email is already registered!" }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [emptyTable] = await conn.execute(
      "SELECT admin_id FROM admins"
    );
    if ((emptyTable as any[]).length === 0) {
      await conn.execute(
        "INSERT INTO admins (name, email, role, status, password) VALUES (?, ?, ?, ?, ?)",
        [name, email, role, 'Approved', hashedPassword]
      );
    } else {
      await conn.execute(
        "INSERT INTO admins (name, email, role, password) VALUES (?, ?, ?, ?)",
        [name, email, role, hashedPassword]
      );
    }


    const [data] = await conn.execute(
      "SELECT admin_id, name, email, created_at FROM admins WHERE email = ?",
      [email]
    );

    await conn.end();

    return new Response(JSON.stringify({ data: data[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("error --->>", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
