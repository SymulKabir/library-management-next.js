import { db } from "@/shared/lib/db";
import { toMySQLDate } from "@/shared/utils/date"; 

export const POST = async (request: Request) => {
  try {
    const { student_id, book_id, issue_date, return_date } = await request.json();

    if (!student_id || !book_id || !issue_date) {
      return Response.json({ message: "Required fields missing" }, { status: 400 });
    }

    const conn = await db();

    const [student] = await conn.execute(
      "SELECT student_id FROM students WHERE student_id = ?",
      [student_id]
    );

    if ((student as any[]).length === 0) {
      await conn.end();
      return Response.json({ message: "Student not found" }, { status: 404 });
    }

    const [book] = await conn.execute(
      "SELECT book_id, availability, stock FROM books WHERE book_id = ?",
      [book_id]
    );

    if ((book as any[]).length === 0) {
      await conn.end();
      return Response.json({ message: "Book not found" }, { status: 404 });
    }

    const bookData = (book as any[])[0];

    if (bookData.stock <= 0) {
      await conn.end();
      return Response.json({ message: "Book is out of stock" }, { status: 400 });
    }

    const mysqlIssueDate = toMySQLDate(issue_date);
    const mysqlReturnDate = return_date ? toMySQLDate(return_date) : null;

    await conn.execute(
      `INSERT INTO issue_records (student_id, book_id, issue_date, return_date, status)
       VALUES (?, ?, ?, ?, ?)`,
      [student_id, book_id, mysqlIssueDate, mysqlReturnDate, "Pending"]
    );

    await conn.execute(
      "UPDATE books SET stock = stock - 1 WHERE book_id = ?",
      [book_id]
    );

    await conn.end();

    return Response.json({ message: "Book issued successfully" });
  } catch (error: any) {
    console.log("error ---->>>", error);
    return Response.json({ message: "Server error", error: error.message }, { status: 500 });
  }
};
