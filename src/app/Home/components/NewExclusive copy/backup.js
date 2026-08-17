"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./styles.scss"; 
import BookSectionTitle from "@/src/components/BookSectionTitle";

interface Book {
  [key: string]: any;
}

const Index: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

   const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ }),
      });
      const { data } = await res.json();
      setBooks(data || []);
    } catch (error:any) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <section className="home-wrapper light-shadow">
      <div className="curated-section">
        <div className="container">
          <BookSectionTitle label={"Exclusive Recommendations"}/> 
          
          <Swiper
            modules={[Autoplay]}
            slidesPerView={2}
            spaceBetween={20}
            loop={true} // Enables infinite scroll
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="horizontal-swiper"
          >
            {books.slice(0, 10).map((book, i) => (
              <SwiperSlide key={i}>
                <div className="curated-card">
                  <img src={book.image_url} alt={book.title} />
                  <div className="overlay">
                    <p>{book.title}</p>
                    <button>View Details</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Index;