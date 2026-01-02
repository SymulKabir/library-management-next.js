'use client';
import React from "react";
import "./styles.scss";
import HeroSection from './components/HeroSection/index';
import Categories from './components/Categories/index';
import Books from './components/Books/index';

const Home = () => {


    return <div className="home-page container">
        <HeroSection />
        <Categories />
        <Books />

    </div>
}


export default Home;