"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import TrendingBookCard from "@/src/components/TrendingBookCard";
import BookSectionTitle from "@/src/components/BookSectionTitle";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";

interface Book {
  [key: string]: any;
}

const Index: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const { progressing, setProgressing, list } = useProgressingUtils(8);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setProgressing(true);
      const res = await fetch("/api/books/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit: 10 }),
      });
      const { data } = await res.json();
      setBooks(data || []);
    } catch (error:any) {
      console.error("Error fetching books:", error);
    } finally {
      setProgressing(false);
    }
  };

  return (
    <section>
      <div className="trending-book-grid-section light-shadow">
        <BookSectionTitle label={"Trending Books"} route={"/book-gallery"} />
        <div className="book-grid-container">
          {books?.length > 0 &&
            books.map((book, index) => (
              <TrendingBookCard book={book} key={index} />
            ))}
          {progressing &&
            list.map((_, index) => {
              return <TrendingBookCard key={index} />;
            })}
        </div>
      </div>
    </section>
  );
};

export default Index;
