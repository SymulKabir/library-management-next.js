'use client'
import { useMemo } from "react";

type Book = {
  title: string;
  author: string;
  category: string;
  availability: number;
  image_url: string;
  stock: number;
};

type Props = {
  book: Book;
  allBooks: Book[];
};

const BookDetails = ({ book, allBooks }: Props) => {
  const relatedBooks = useMemo(() => {
    return allBooks
      .filter((b) => b.category === book.category && b.title !== book.title)
      .slice(0, 8);
  }, [book, allBooks]);

  return (
    <div className="book-details">
      <div className="book-main">
        <div className="book-image">
          <img src={book.image_url} alt={book.title} />
        </div>

        <div className="book-info">
          <span className="badge">{book.category}</span>

          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>

          <div className="meta">
            <span className={book.stock > 0 ? "stock in" : "stock out"}>
              {book.stock > 0 ? `${book.stock} available` : "Out of stock"}
            </span>

            <span className="availability">
              {book.availability ? "Available" : "Not Available"}
            </span>
          </div>

          <button className="primary-btn">Borrow Book</button>
        </div>
      </div>

      <div className="related">
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
      </div>
    </div>
  );
};

export default BookDetails;