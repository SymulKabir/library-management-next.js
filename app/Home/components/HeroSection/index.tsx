'use client';
import React, { useEffect, useRef } from "react";
import "./styles.scss";
import Image from "next/image";

const HeroSection: React.FC = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const innerHeroRef = useRef<HTMLDivElement | null>(null);

    const config = [
        { imgUrl: '/assets/home/hero-section-img-1.png' },
        { imgUrl: '/assets/home/hero-section-img-2.png' },
        { imgUrl: '/assets/home/hero-section-img-3.png' },
        { imgUrl: '/assets/home/hero-section-img-4.png' }
    ];

    useEffect(() => {
        if (!heroRef.current || !innerHeroRef.current) return;

        const updateHeight = () => {
            const innerHeight = innerHeroRef.current?.offsetHeight || 0;
            heroRef.current!.style.height = `${innerHeight}px`;
        };

        updateHeight();

        const observer = new ResizeObserver(() => updateHeight());
        observer.observe(innerHeroRef.current);

        window.addEventListener("resize", updateHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    return (
        <section className="hero-section light-shadow" ref={heroRef}>
            <div className="inner-hero" ref={innerHeroRef}>
                <Image height={100} width={100} src={config[0].imgUrl} alt="" />
            </div>

            <div className="right-section">
                {config.slice(1).map((item, index) => (
                    <div
                        key={index}
                        className="img-container"
                    >
                        <Image
                            height={100}
                            width={100}
                            src={item.imgUrl}
                            alt=""
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
