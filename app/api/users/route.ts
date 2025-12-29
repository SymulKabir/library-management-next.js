import bcrypt from 'bcryptjs';
import { db } from "@/shared/lib/db";

export const GET = async (request: Request) => {
  try {
    const conn = await db();
    const [rows] = await conn.execute("SELECT * FROM users");
    await conn.end();
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};


export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, confirmPassword } = body;

  if (!name || !email || !password || !confirmPassword) {
    return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
  }

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ message: "Passwords do not match." }), { status: 400 });
  }

  const conn = await db();

  const [existingUsers] = await conn.execute("SELECT id FROM users WHERE email = ?", [email]);
  if ((existingUsers as any[]).length > 0) {
    await conn.end();
    return new Response(JSON.stringify({ message: "Email is already registered." }), { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await conn.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  const [data] = await conn.execute(
    "SELECT id, name, email, created_at FROM users WHERE email = ?",
    [email]
  );

  await conn.end();

  return new Response(JSON.stringify({ data: data[0] }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
