"use client";

import React from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";

const Index = ({ book }: { book?: any }) => {
  const router = useRouter(); 
  const handleDetailsPageNav = (id: string) => {
    router.push(`/books/${id}`);
  };
  if (!book) {
    return (
      <div className="curated-card skeleton-card">
        <div className="skeleton-img"></div>
        <div className="overlay">
          <div className="skeleton-text"></div>
          <div className="skeleton-btn"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="curated-card">
      <img src={book.image_url} alt={book.title} />
      <div className="overlay">
        <p>{book.title}</p>
        <button onClick={() => handleDetailsPageNav(book.book_id)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default Index;
