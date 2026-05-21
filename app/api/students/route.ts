import bcrypt from 'bcryptjs';
import { db } from "@/shared/lib/db";


export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, department, phone, password, confirmPassword } = body;
  console.log("body -->>>", body)

  if (!name || !email || !department || !phone || !password || !confirmPassword) {
    return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
  }

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ message: "Passwords do not match." }), { status: 400 });
  }

  const conn = await db();

  const [existingEmail] = await conn.execute("SELECT student_id FROM students WHERE email = ?", [email]);
  if ((existingEmail as any[]).length > 0) {
    await conn.end();
    return new Response(JSON.stringify({ message: "Email is already registered!" }), { status: 409 });
  }
  const [existingPhone] = await conn.execute("SELECT student_id FROM students WHERE phone = ?", [ phone]);
  if ((existingPhone as any[]).length > 0) {
    await conn.end();
    return new Response(JSON.stringify({ message: "Phone number is already registered!" }), { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await conn.execute(
    "INSERT INTO students (name, email, phone, department, password) VALUES (?, ?, ?, ?, ?)",
    [name, email, phone, department, hashedPassword]
  );

  const [data] = await conn.execute(
    "SELECT student_id, name, email, created_at FROM students WHERE email = ?",
    [email]
  );

  await conn.end();

  return new Response(JSON.stringify({ data: data[0] }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
