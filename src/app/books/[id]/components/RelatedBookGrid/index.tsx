'use client'
import React, { useEffect, useState } from "react";
import './styles.scss'
import { getFilteredBook } from "@/src/services/book";

const RelatedBookGrid = (category) => {
    const [page, setPage] = useState(1)
    const [relatedBooks, setRelatedBooks] = useState([])

    useEffect(() => {
        if (category) {
            getFilteredBook(category, page).then((data) => {
                setRelatedBooks(data.data || []);
            });
        } else {
            setRelatedBooks([])
        }
    }, [category])


    return <section className="related-books-section">
        <div className="related-header">
            <h2>Related Books</h2>
            <p>Books you may also like</p>
        </div>

        <div className="related-grid">
            {relatedBooks.map((b, i) => (
                <div className="card" key={i}>
                    <div className="card-img">
                        <img src={b.image_url} alt={b.title} />
                    </div>

                    <div className="card-body">
                        <h4>{b.title}</h4>
                        <p>{b.author}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>

}




export default RelatedBookGrid;