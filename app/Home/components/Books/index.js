'use client';
import React, { useEffect, useState } from "react";
import './styles.scss'
import BookCard from '../BookCard/index'

const Index = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);



    useEffect(() => {
        fetchBooks();
    }, [])
    const fetchBooks = async () => {
        try {
            const res = await fetch("/api/books/get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page, limit: 10 }),
            });
            const { data } = await res.json();
            setBooks(data || []);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };



    return <section className="container ">
        <div className="book-grid-section">
            <div className="book-grid-title"><h3>Books</h3>
            </div>
            <div className="book-grid-container">
                {books?.length > 0 &&
                    books.map((book, index) => {
                        return <BookCard book={book} key={index} />;
                    })}
            </div>
        </div>
    </section>
}


export default Index;