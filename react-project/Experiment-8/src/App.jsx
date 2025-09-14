import React, { useState } from "react";
import BookList from "./components/BookList";
import "./App.css";

export default function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const addBook = () => {
    if (!title.trim() || !author.trim()) return;
    setBooks([
      ...books,
      { id: Date.now(), title: title.trim(), author: author.trim() },
    ]);
    setTitle("");
    setAuthor("");
  };

  const removeBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const filteredBooks = books.filter((book) => {
    const bookTitle = book.title || "";
    const bookAuthor = book.author || "";
    const lowerSearch = search.toLowerCase();
    return (
      bookTitle.toLowerCase().includes(lowerSearch) ||
      bookAuthor.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="container">
      <h1>Library Management</h1>
      <input
        type="text"
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="book-form">
        <input
          type="text"
          placeholder="New book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="New book author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>

      <BookList books={filteredBooks} onRemove={removeBook} />
    </div>
  );
}
