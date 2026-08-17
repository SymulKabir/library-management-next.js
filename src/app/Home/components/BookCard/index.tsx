"use client";
import React, { useState } from "react";
import "./styles.scss";
import Link from "next/link";
import { BsBookHalf } from "react-icons/bs";
import useStudent from "@/src/hooks/useStudent";
import { useRouter } from "next/navigation";
import { warningToast, promiseToast } from "@/src/utils/toast";
import useBook from "@/src/hooks/useBook";

const BookCard = ({ book }: { book?: any }) => { 
  const { bookBorrowProgressing, handleBorrowBook } = useBook();


  const studentState = useStudent();
  const student = studentState.data;
  const router = useRouter();
  if (!book) {
    return (
      <div className="book-cart skeleton-card">
        <div className="card-img skeleton-img"></div>
        <div className="book-details">
          <div className="skeleton-title"></div>
        </div>
        <div className="borrow-btn skeleton-btn"></div>
      </div>
    );
  }

  // const issueBook = async () => {
  //   try {
  //     setProgressing(true);
  //     const res = await fetch("/api/issue-records/issue", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         student_id: student.student_id,
  //         book_id: book.book_id,
  //         issue_date: new Date().toISOString(),
  //         return_date: new Date(
  //           Date.now() + 14 * 24 * 60 * 60 * 1000,
  //         ).toISOString(),
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.message || "Something went wrong");
  //     }

  //     return data;
  //   } catch (error: any) {
  //     throw new Error(error.message || "Something went wrong");
  //   } finally {
  //     setProgressing(false);
  //   }
  // };

 

  return (
    <div className="book-cart">
      <Link href={`/books/${book.book_id}`}>
        <div className="card-img">
          {book?.image_url ? (
            <img
              src={book.image_url}
              height={100}
              width={100}
              alt={book.title}
            />
          ) : null}
        </div>
        <div className="book-details">
          <h6>{book.title}</h6>
        </div>
      </Link>

      <button
        className="borrow-btn"
        disabled={bookBorrowProgressing}
        onClick={() => handleBorrowBook(book.book_id)}
      >
        <BsBookHalf />
        Borrow
      </button>
    </div>
  );
};

export default BookCard;
