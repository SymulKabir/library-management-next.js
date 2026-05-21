"use client";
import React, { useState } from "react";
import "./styles.scss";
import Link from "next/link";
import { BsBookHalf } from "react-icons/bs";
import useStudent from "@/shared/hooks/useStudent";
import { useRouter } from "next/navigation";
import { warningToast, promiseToast } from "@/shared/utils/toast";

const BookCard = ({ book }) => {
  const [progressing, setProgressing] = useState(false);
  const studentState = useStudent();
  const student = studentState.data;
  const router = useRouter();


  const issueBook = async () => {
    setProgressing(true);
    try {
      const res = await fetch("/api/issue-records/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.student_id,
          book_id: book.book_id,
          issue_date: new Date().toISOString(),
          return_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Something went wrong");

    } finally {
      setProgressing(false);
    }
  };

  const handleBorrow = async () => {
    if (progressing) {
      return
    }
    if (!student || !student.student_id) {
      warningToast("Please sign up first!");
      router.push("/signup");
      return;
    }

    await promiseToast(issueBook(), {
      pending: "Issuing book...",
      success: {
        render: ({ data }) => `Book issued successfully!`
      },
      error: {
        render: ({ data }) => `${data.message}`
      }
    });
  };

  return (
    <div className="book-cart">
      <Link href={`/`}>
        <div className="card-img">
          {book?.image_url ? (
            <img src={book.image_url} height={100} width={100} alt={book.title} />
          ) : null}
        </div>
        <div className="book-details">
          <h6>{book.title}</h6>
        </div>
      </Link>

      <button className="borrow-btn" disabled={progressing} onClick={handleBorrow}>
        <BsBookHalf />
        Borrow
      </button>
    </div>
  );
};

export default BookCard;
