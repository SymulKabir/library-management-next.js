"use client";
import { useEffect, useState } from "react";
import useStudent from "@/src/hooks/useStudent";
import { warningToast, promiseToast } from "@/src/utils/toast";
import { useRouter } from "next/navigation";

const useBook = () => {
  const [progressing, setProgressing] = useState(true);
  const [bookBorrowProgressing, setBookBorrowProgressing] = useState(false);

  const studentState = useStudent();
  const student = studentState.data;
  const router = useRouter();

  const issueBook = async (bookId: string) => {
    setProgressing(true);
    try {
      const res = await fetch("/api/issue-records/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.student_id,
          book_id: bookId,
          issue_date: new Date().toISOString(),
          return_date: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error: any) {
      console.log(error.message || "Something went wrong");
    } finally {
      setProgressing(false);
    }
  };

  const handleBorrowBook = async (bookId: string) => {
    try {
      console.log("HEllo form start start")
      if (bookBorrowProgressing || !bookId) {
        return;
      }
      setBookBorrowProgressing(true)
      console.log("HEllo form pass if")

      if (!student || !student.student_id) {
        warningToast("Please sign up first!");
        router.push("/signup");
        return;
      }

      await promiseToast(issueBook(bookId), {
        pending: "Issuing book...",
        success: "Book issued successfully!",
        error: "Failed to issue book.",
      });
    } catch (error: any) {

    } finally {
      setBookBorrowProgressing(false)

    }
  };

  return { progressing, bookBorrowProgressing, handleBorrowBook };
};

export default useBook;
