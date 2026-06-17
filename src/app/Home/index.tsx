'use client';
import React from "react";
import "./styles.scss";
import HeroSection from './components/HeroSection/index';
import Books from './components/Books/index';
import TrendingBooks from './components/TrendingBooks/index';

const Home = () => {
    return <div className="home-page container">
        <HeroSection />
        <TrendingBooks />
        <Books />

    </div>
}


export default Home;