"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import HeroSection from "./components/HeroSection/index";
import Books from "./components/Books/index";
import ExclusiveRecommendation from "@/src/components/ExclusiveRecommendation"; 
import TrendingBooks from "./components/TrendingBooks";
import CategorySpotlight from "./components/CategorySpotlight";
import { useSearchParams } from "next/navigation";
import useFaceAuth from "@/src/hooks/useFaceAuth";

const Home = () => { 
  const searchParams = useSearchParams();
  const { openModal: openAuthModal, modal: FaceAuthModal } = useFaceAuth();
  const sessionID = searchParams.get("session");
  useEffect(() => {
    if (sessionID) {
      openAuthModal();
    }
  }, [sessionID]);

  return (
    <div className="home-page"> 
      <HeroSection />
      <ExclusiveRecommendation />
      <CategorySpotlight />
      <TrendingBooks />
      <Books />
      {sessionID && <FaceAuthModal />}
    </div>
  );
};

export default Home;
