import { db } from "@/shared/lib/db";

export async function GET(request: Request) {
  // For example, fetch data from your DB here

  const conn = await db();
  const [rows] = await conn.execute("SELECT * FROM users");
  return Response.json(rows);
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, confirmPassword } = body;

  const newUser = { id: Date.now(), name };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
