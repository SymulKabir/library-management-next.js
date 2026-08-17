"use client";
import React, { useEffect, useState } from "react";
import BookSpotlight from "@/src/components/BookSpotlight";
import Banner from "@/src/components/Banner";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";

interface Book {
  [key: string]: any;
}

const Index: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { progressing, setProgressing } = useProgressingUtils();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setProgressing(true); 
      const res = await fetch("/api/books/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: 1, limit: 10 }),
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
    <BookSpotlight
      label={"Exclusive Recommendations"}
      books={books}
      progressing={progressing}
    />
  );
};

export default Index;
