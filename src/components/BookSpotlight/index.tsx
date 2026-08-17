"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./styles.scss";
import BookSectionTitle from "@/src/components/BookSectionTitle";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";
import CuratedCard from "@/src/components/CuratedCard";

interface Props {
  label: string;
  books: [object];
  progressing?: boolean;
}

const Index: any = ({ label, books, progressing }: Props) => {
  const { list } = useProgressingUtils();
 

  return (
    <section>
      <div className="home-wrapper light-shadow">
        <div className="curated-section">
          <div className="container">
            <BookSectionTitle label={label} />

            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={2} // Mobile default
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
                1280: { slidesPerView: 6, spaceBetween: 20 }, // 6 items for large screens
              }}
              className="horizontal-scroll"
            >
              {!!books.length &&
                books.map((book, i) => (
                  <SwiperSlide key={i}>
                    <CuratedCard book={book} />
                  </SwiperSlide>
                ))}
              {progressing &&
                list.map((_, index) => (
                  <SwiperSlide key={index}>
                    <CuratedCard />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
