import React from 'react';
import './styles.scss'


const DetailsCard = ({ book }) => {
  return <div className="book-card-section">
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
}



export default DetailsCard;