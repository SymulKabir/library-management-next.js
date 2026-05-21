'use client'
import './styles.scss'
import React, { useState } from 'react'
import { LuSearch } from "react-icons/lu"

type Book = {
    title: string
    author: string
}

type ApiResponse = {
    data: Book[]
}

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState<string>('')

    const [results, setResults] = useState<Book[]>([
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    ])

    const handleSearch = async (): Promise<void> => {
        try {
            const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
            const data: ApiResponse = await res.json()

            setResults(data.data || [])
        } catch (error) {
            console.error('Error searching books:', error)
        }
    }

    return (
        <section className='book-search-section'>
            <div className='search-container'>
                <input
                    type="search"
                    value={query}
                    placeholder='What are you looking for?'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>
                    <LuSearch />
                </button>
            </div>

            <div className='search-result-container'>
                {results.length > 0 ? (
                    <ul>
                        {results.map((book: Book, index: number) => (
                            <li key={index}>
                                <LuSearch /> {book.title} by {book.author}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </section>
    )
}

export default BookSearch