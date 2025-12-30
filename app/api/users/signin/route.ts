import bcrypt from 'bcryptjs';
import { db } from "@/shared/lib/db";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required." }), { status: 400 });
    }

    const conn = await db();
    const [users] = await conn.execute("SELECT id, name, email, password, created_at FROM users WHERE email = ?", [email]);
    await conn.end();

    const user = (users as any[])[0];

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid email or password." }), { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid email or password." }), { status: 401 });
    }

    // Return user data excluding password
    const { password: _pwd, ...userData } = user;

    return new Response(JSON.stringify({ data: userData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


 