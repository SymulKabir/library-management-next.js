'use client';
import React, { useState } from "react";
import "./styles.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";


const Categories = () => {
  const [categories, setCategories] = useState([
    {
      _id: "1",
      label: "Fiction",
      value: "fiction",
      img: "images/categories/fiction.png",
    },
    {
      _id: "2",
      label: "Science",
      value: "science",
      img: "images/categories/science.png",
    }])

return <section className="categories py-2 py-md-5">
    <Swiper
      slidesPerView={5}
      spaceBetween={10}
      fade={true}
      grabCursor={true}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      breakpoints={{
        0: {
          slidesPerView: 2,
          spaceBetween: 5,
        },
        350: {
          slidesPerView: 3,
        },
        700: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 7,
          spaceBetween: 10,
        },
      }}
      className="inner-categories"
    >
      { categories.map((category, index) => {
        console.log("category", category)
        return (
          <SwiperSlide key={index}>
            <Link href={`/search?cate=${category.value}`}>
              <img src={`${process.env.REACT_APP_SERVER_HOST_URL}/${category.img}`} alt="" />
              <p>{category.label}</p>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  </section>
}


export default Categories;