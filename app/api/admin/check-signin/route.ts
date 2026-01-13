import jwt from 'jsonwebtoken';
import { db } from '@/shared/lib/db';

export async function GET(request: Request) {
  try {

    console.log("Hello from check-signin =====================>>>");

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401 });
    }
console.log("decoded ->", decoded);
    const conn = await db();
    const [admins] = await conn.execute(
      'SELECT admin_id, name, email, created_at FROM admins WHERE admin_id = ? and email = ?',
      [decoded.admin_id, decoded.email]
    );
    await conn.end();

    const user = (admins as any[])[0];
console.log("user ->", user);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ data: user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
