import bcrypt from 'bcryptjs';
import { db } from "@/shared/lib/db";
import { generateToken } from '@/shared/utils/token';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required!" }),
        { status: 400 }
      );
    }

    const conn = await db();
    const [admins] = await conn.execute(
      "SELECT admin_id, name, email, password, status, created_at FROM admins WHERE email = ?",
      [email]
    );
    await conn.end();

    const user = (admins as any[])[0];

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password!" }),
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password!" }),
        { status: 401 }
      );
    }

    // 🔥 NEW: Status check
    if (user.status !== "Approved") {
      return new Response(
        JSON.stringify({
          message: `Your account status is '${user.status}'. Please contact admin.`,
        }),
        { status: 403 }
      );
    } 
    const { password: _, ...userData } = user;

    const token = generateToken({
      admin_id: user.admin_id,
      email: user.email,
    });

    return new Response(JSON.stringify({ data: userData, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
