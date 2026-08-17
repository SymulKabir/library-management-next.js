"use client";
import React, { useEffect, useState } from "react";
import BookSpotlight from "@/src/components/BookSpotlight";
import { getFilteredBook } from "@/src/services/book";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";

interface Book {
  [key: string]: any;
}
interface AuthorBooksProps {
  category?: string;
}
const Index: React.FC<AuthorBooksProps>  = ({ category }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const { progressing, setProgressing } = useProgressingUtils(8);
  const page = 1;

  useEffect(() => {
    setProgressing(true);
    if (category) {
      getFilteredBook({ category: category }, page).then((data) => {
        setBooks(data.data || []);
        setProgressing(false);
      });
    } else {
      setBooks([]);
      setProgressing(false);
    }
  }, [category]);

  return (
    <BookSpotlight
      label={`Books in Category: ${category || "All"}`}
      books={books}
      progressing={progressing}
    />
  );
};

export default Index;
