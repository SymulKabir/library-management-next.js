"user client";
import React from "react";
import "./styles.scss";
import { MdShoppingCart } from "react-icons/md";
import useBook from "@/src/hooks/useBook";
import { useRouter } from "next/navigation";

const Index = ({ book }: { book?: any }) => {
  const { bookBorrowProgressing, handleBorrowBook } = useBook();
  const router = useRouter()
  if (!book) {
    return (
      <div className="search-book-card skeleton-card">
        <div className="product-img-wrapper skeleton-img"></div>
        <div className="product-details">
          <div className="skeleton-title"></div>
          <div className="skeleton-author"></div>
          <div className="skeleton-category"></div>
          <div className="card-footer">
            <div className="skeleton-stock"></div>
            <div className="skeleton-btn"></div>
          </div>
        </div>
      </div>
    );
  }
  const handleViewDetails = (id:string) => {
    router.push(`/books/${id}`)
  }

  return (
    <div className="search-book-card" key={book.book_id}>
      <div className="product-img-wrapper">
        <img
          src={
            book.image_url ||
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
          }
          alt={book.title}
        />
      </div>
      <div className="product-details">
        <h4 onClick={() => handleViewDetails(book.book_id)}>{book.title}</h4>
        <p className="author-name" >By {book.author}</p>
        <span className="book-category">{book.category || "General"}</span>
        <div className="card-footer">
          <span className="stock-info">Available Stock: {book.stock}</span>
          <button
            className="add-to-cart-btn"
            disabled={bookBorrowProgressing}
            onClick={() => handleBorrowBook(book.book_id)}
          >
            <MdShoppingCart /> Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
