"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import { searchBookByMetadata } from "@/src/services/book";
import { useRouter } from "next/navigation";
import BookSectionTitle from "@/src/components/BookSectionTitle";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";
import SearchBookCard from "@/src/components/SearchBookCard";

const Index = ({ book }: { book?: any }) => {
  const [relatedBooks, setRelatedBooks] = useState([]);
  const router = useRouter();
  const { progressing, setProgressing, list } = useProgressingUtils(20);

  useEffect(() => {
    (async () => {
      try {
        setProgressing(true);
        const { data } = await searchBookByMetadata({
          title: book.title,
          author: book.author,
          category: book.category,
        });
        setRelatedBooks(data || []);
      } catch (error:any) {
      } finally {
        setProgressing(false);
      }
    })();
  }, []);

 

  return (
    <section className="related-books-section">
      <BookSectionTitle label={"Recommended Books"} />

      <div className="related-grid">
        {!!relatedBooks.length &&
          relatedBooks.map((book: any, index) => (
            <SearchBookCard book={book} key={index} />
          ))}
        {progressing &&
          list.map((_, index) => <SearchBookCard key={index} />)}
      </div>
    </section>
  );
};

export default Index;
