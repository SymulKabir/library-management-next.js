"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "./styles.scss";
import CategoryCard from "./components/CategoryCard";
import useProgressingUtils from "@/src/hooks/useProgressingUtils";
import useCategories from "@/src/hooks/useCategories";

const Index = () => {
  const { list } = useProgressingUtils(6);
  const { categoriesProgressing, categories } = useCategories();

  console.log("categories ============>>>>>>>>>>>>>>>", categories)
  return (
    <section className="category-spotlight light-shadow">
      <div className="header-wrapper">
        <span className="subtitle">Browse Library</span>
        <h2 className="section-title">Explore by Category</h2>
      </div>
      <Swiper
        slidesPerView={2}
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
        observer={true}
        observeParents={true}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 20 },
          992: { slidesPerView: 5, spaceBetween: 20 },
          1200: { slidesPerView: 6, spaceBetween: 25 },
        }}
        className="category-swiper"
      >
        {categories && categories.length > 0
          ? categories.map((cat: any, i:number) => {
              return (
                <SwiperSlide key={i}>
                  <CategoryCard data={cat} />
                </SwiperSlide>
              );
            })
          : categoriesProgressing &&
            list.map((_, i) => (
              <SwiperSlide key={i}>
                <CategoryCard />
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );
};

export default Index;
