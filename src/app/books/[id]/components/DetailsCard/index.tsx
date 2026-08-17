"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import TrendingBookCard from "@/src/components/TrendingBookCard";
import useBook from "@/src/hooks/useBook";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";

const Index = ({ book }: { book: any }) => {
  const { bookBorrowProgressing, handleBorrowBook } = useBook();
  const [relatedBooks, setRelatedBooks] = useState([]);
  const {
    progressing: progressingBookFetching,
    setProgressing: setProgressingBookFetching,
    list,
  } = useProgressingUtils(4);
  const page = 1;
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setProgressingBookFetching(true);
      const res = await fetch("/api/books/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: 1, limit: 10, author: book.author }),
      });
      const { data } = await res.json();
      setRelatedBooks(data || []);
    } catch (error:any) {
      console.error("Error fetching books:", error);
    } finally {
      setProgressingBookFetching(false);
    }
  };

  return (
    <div className="book-card-section">
      <div className="book-image">
        <img src={book.image_url} alt={book.title} />
      </div>

      <div className="details-section">
        <div className="book-info">
          <span className="badge">{book.category}</span>

          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>

          <div className="meta">
            <span className={book.stock > 0 ? "stock in" : "stock out"}>
              {book.stock > 0 ? `${book.stock} available` : "Out of stock"}
            </span>

            <span className="availability">
              {book.availability ? "Available" : "Not Available"}
            </span>
          </div>

          <button
            className="primary-btn"
            disabled={bookBorrowProgressing}
            onClick={() => {
              console.log("hello")
              handleBorrowBook(book.book_id)
            }}
          >
            Borrow Book
          </button>
        </div>
        <div className="categorical-items">
          {!!relatedBooks.length &&
            relatedBooks
              .slice(0, 6)
              .map((book, index) => (
                <TrendingBookCard book={book} key={index} />
              ))}
          {progressingBookFetching &&
            list.map((_, index) => <TrendingBookCard key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default Index;
