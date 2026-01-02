
'use client';
import React, { useState } from "react";
import "./styles.scss";
import Slider from "../Slider/Slider";
import Image from "next/image";

const HeroSection = () => {
    const [config, setConfig] = useState(null);

    return <section className="hero-section light-shadow">
        <div className="inner-hero">
            <Slider
                slideInfo={config?.sliderImg?.length > 0 ? config.sliderImg : []}
            />
        </div>
        <div className="right-section">
            <Image
                height={100}
                width={100}
                src={
                    config?.heroImg?.imgOne
                        ? `${process.env.REACT_APP_SERVER_HOST_URL}/${config?.heroImg?.imgOne}`
                        : ""
                }
                alt=""
            />
            <Image
                height={100}
                width={100}
                src={
                    config?.heroImg?.imgTwo
                        ? `${process.env.REACT_APP_SERVER_HOST_URL}/${config?.heroImg?.imgTwo}`
                        : ""
                }
                alt=""
            />
            <Image
                height={100}
                width={100}
                src={
                    config?.heroImg?.imgThree
                        ? `${process.env.REACT_APP_SERVER_HOST_URL}/${config?.heroImg?.imgThree}`
                        : ""
                }
                alt=""
            />
        </div>
    </section>
}


export default HeroSection;