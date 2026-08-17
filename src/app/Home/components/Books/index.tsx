"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import BookCard from "../BookCard/index";
import BookSectionTitle from "@/src/components/BookSectionTitle";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";

interface Book {
  [key: string]: any;
}

const Index: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const {progressing, setProgressing, list} = useProgressingUtils(20)

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setProgressing(true)
      const res = await fetch("/api/books/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit: 10 }),
      });
      const { data } = await res.json();
      setBooks(data || []);
    } catch (error:any) {
      console.error("Error fetching books:", error);
    }finally{
      setProgressing(false)

    }
  };

  return (
    <section>
      <div className="book-grid-section ">
        <BookSectionTitle label={"Books Gallery"} route={"/book-gallery"} />
        <div className="book-grid-container ">
          {books?.length > 0 &&
            books.map((book, index) => <BookCard book={book} key={index} />)}
            {
              progressing && list.map((_, index) => <BookCard   key={index} />)
            }
        </div>
      </div>
    </section>
  );
};

export default Index;
