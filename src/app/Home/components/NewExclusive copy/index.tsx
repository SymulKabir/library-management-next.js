"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss"; 
import BookSectionTitle from "@/src/components/BookSectionTitle";

interface Book {
  [key: string]: any;
}

const Index: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit: 10 }),
      });
      const { data } = await res.json();
      setBooks(data || []);
    } catch (error:any) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <section>
      <div className="home-wrapper light-shadow">
        <div className="curated-section">
          <div className="container">
            <BookSectionTitle label={"Exclusive Recommendations"}/> 
            <div className="horizontal-scroll">
              {books.slice(0, 6).map((book, i) => (
                <div key={i} className="curated-card">
                  <img src={book.image_url} alt={book.title} />
                  <div className="overlay">
                    <p>{book.title}</p>
                    <button>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
