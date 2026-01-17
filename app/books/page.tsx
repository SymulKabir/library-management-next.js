'use client';
import React from "react";
import "./styles.scss";
import BooksComponent from './components/Books/index';
import HeaderLayout from "@/shared/layouts/HeaderLayout";

const Books = () => {
    return <HeaderLayout>
        <div className="container">
            <BooksComponent />
        </div>
    </HeaderLayout>

}


export default Books;