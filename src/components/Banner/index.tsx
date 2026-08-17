'use client'
import React from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";

const HeroBanner = () => {
  const router = useRouter();

  return (
    <section className="banner-section light-shadow">
      <div className="banner-content">
        <span className="badge">Welcome to BookHive</span>
        <h1>
          Your Gateway to <br /> Academic Success
        </h1>
        <p>
          Explore our curated collection of books and digital archives. Borrow,
          reserve, and manage your academic readings with ease.
        </p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => router.push("/book-gallery")}>
            Browse Books
          </button>
        </div>
      </div>
      <div className="hero-image">
        {/* Use a clean, bright library illustration or photo here */}
        <div className="placeholder-art">
          <img src="/assets/home/banner.jpg" alt="" />
        </div>
      </div>
    </section>
  );
};
export default HeroBanner;
