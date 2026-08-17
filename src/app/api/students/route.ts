import bcrypt from "bcryptjs";
import { db } from "@/src/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { faceId, name, email, department, phone, password, confirmPassword } =
    body;

  if (
    !name ||
    !email ||
    !department ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    return new Response(
      JSON.stringify({ message: "All fields are required." }),
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return new Response(
      JSON.stringify({ message: "Passwords do not match." }),
      { status: 400 },
    );
  }

  const conn = await db();

  const [existingEmail] = await conn.execute(
    "SELECT student_id FROM students WHERE email = ?",
    [email],
  );
  if ((existingEmail as any[]).length > 0) {
    await conn.end();
    return new Response(
      JSON.stringify({ message: "Email is already registered!" }),
      { status: 409 },
    );
  }
  const [existingPhone] = await conn.execute(
    "SELECT student_id FROM students WHERE phone = ?",
    [phone],
  );
  if ((existingPhone as any[]).length > 0) {
    await conn.end();
    return new Response(
      JSON.stringify({ message: "Phone number is already registered!" }),
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = faceId
    ? "INSERT INTO students (name, email, phone, department, password, face_id) VALUES (?, ?, ?, ?, ?, ?)"
    : "INSERT INTO students (name, email, phone, department, password) VALUES (?, ?, ?, ?, ?)";

  const params = faceId
    ? [name, email, phone, department, hashedPassword, faceId]
    : [name, email, phone, department, hashedPassword];

  await conn.execute(query, params);

  const [data] = await conn.execute(
    "SELECT student_id, name, email, face_id, created_at FROM students WHERE email = ?",
    [email],
  );

  const currentData = data as any[]
  await conn.end();

  return new Response(JSON.stringify({ data: currentData[0] }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
