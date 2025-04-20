import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import axios from "axios";
import { Book, SearchResult } from "./types";
import BookDetails from "./components/BookDetails";
import Main from "./components/Main";

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center mt-8">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const booksPerPage = 9; // Set items per page

  useEffect(() => {
    setLoading(true);
    axios
      .get<{ books: Book[]; totalBooks: number }>(
        `${import.meta.env.VITE_API_URL}/api/books/books?page=${currentPage}&limit=${booksPerPage}`
      )
      .then((response) => {
        setBooks(response.data.books);
        setTotalBooks(response.data.totalBooks);
      })
      .catch((error) => console.error("Error fetching books:", error))
      .finally(() => setLoading(false));
  }, [currentPage]);

  const handleSearch = (results: SearchResult[]) => {
    setSearchResults(results);
    setTotalBooks(results.length);

    setCurrentPage(1); // Reset to the first page when searching
  };

  return (
    <Router>
      <div className="mx-auto flex flex-col items-center">
        <div className="min-w-full bg-gray-800 p-4">
          <div className="px-44 flex flex-col justify-center items-center">
            <h1
              className="text-3xl text-white font-bold mb-8 cursor-pointer"
              onClick={() => window.location.href = "/"}
            >
              Book Search App
            </h1>
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <Main
                loading={loading}
                Spinner={Spinner}
                handleSearch={handleSearch}
                searchResults={searchResults}
                books={books}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalBooks={totalBooks}
                isSearchMode={searchResults.length > 0}
              />
            }
          />
          <Route path="/book/:bookId" element={<BookDetailsWrapper />} />
        </Routes>
      </div>
    </Router>
  );
};

const BookDetailsWrapper: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<Book>(`${import.meta.env.VITE_API_URL}/api/books/book/${bookId}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error fetching book details:", error))
      .finally(() => setLoading(false));
  }, [bookId]);

  return loading ? <Spinner /> : <BookDetails book={book} />;
};

export default App;
