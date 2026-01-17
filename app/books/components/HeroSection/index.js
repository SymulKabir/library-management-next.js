
'use client';
import React, { useState } from "react";
import "./styles.scss";
// import Slider from "../Slider/Slider";
import Image from "next/image";

const HeroSection = () => {
    const config = [
        {
            imgUrl: '/assets/home/hero-section-img-1.png'
        },
        {
            imgUrl: '/assets/home/hero-section-img-2.png'
        }, {
            imgUrl: '/assets/home/hero-section-img-3.png'
        }, {
            imgUrl: '/assets/home/hero-section-img-1.png'
        }
    ]

    return <section className="hero-section light-shadow">
        <div className="inner-hero">
            <Image
                height={100}
                width={100}
                src={
                    config[0].imgUrl
                }
                alt=""
            />
        </div>
        <div className="right-section">
            {
                config.slice(1, 4).map((item, index) => {
                    return <Image
                        key={index}
                        height={100}
                        width={100}
                        src={
                            item.imgUrl
                        }
                        alt=""
                    />
                })
            }

        </div>
    </section>
}


export default HeroSection;