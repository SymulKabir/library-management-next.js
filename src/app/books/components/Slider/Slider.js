"use client";

import React from 'react';
import './styles.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


const defaultItem = [{_id: "1", image: "assets/slider1.jpg"},
                     {_id: "2", image: "assets/slider2.jpg"},
                     {_id: "3", image: "assets/slider3.jpg"}];  
const Slider = ({slideInfo=[...defaultItem]}) => {
    return (
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="carosel"
      >
        {slideInfo.length > 0 ? (
          slideInfo.map((info) => {
            return (
              <SwiperSlide key={info._id}>
                <img
                  alt=""
                  src={`${process.env.REACT_APP_SERVER_HOST_URL}/${info}`}
                />
              </SwiperSlide>
            );
          })
        ) : (
          <SwiperSlide className='no-img'>
            <p />
          </SwiperSlide>
        )}

        {/* <SwiperSlide>
          <img alt="img" src={slideImg} />
        </SwiperSlide>
        <SwiperSlide>
          <img alt="img" src={slideImg} />
        </SwiperSlide>
        <SwiperSlide>
          <img alt="img" src={slideImg} />
        </SwiperSlide> */}
      </Swiper>
    );
};

export default Slider;