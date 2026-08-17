"use client";
import React from "react";
import "./styles.scss";
import Link from "next/link";

const Index = ({ book }: { book?: any }) => {
  if (!book) {
    return (
      <div className="trending-book-cart skeleton-card">
        <div className="card-img skeleton-img"></div>
        <div className="book-details">
          <div className="skeleton-title"></div>
          <div className="skeleton-title short"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-book-cart">
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
    </div>
  );
};

export default Index;
