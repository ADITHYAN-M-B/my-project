import React from "react";

function BookList({ books, onRemove }) {
  if (!books || books.length === 0) {
    return <p className="no-results">No books found.</p>;
  }
  return (
    <div className="book-list">
      {books.map((book) => (
        <div key={book.id} className="book-item">
          <strong>{book.title}</strong> by {book.author}
          <button onClick={() => onRemove(book.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default BookList;
