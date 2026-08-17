"use client";
import React from "react";
import Link from "next/link";
import './styles.scss' 
import { HiOutlineArrowLongRight } from "react-icons/hi2"; 


interface Props {
  label: string;
  route?: string;
}

const Index = ({ label, route }: Props) => {
  return (
    <div className="book-section-title">
      <h3>{label}</h3>
      {route && <Link href={route}> <span>See all </span> 
       <HiOutlineArrowLongRight/>
       </Link>}
    </div>
  );
};

export default Index;
