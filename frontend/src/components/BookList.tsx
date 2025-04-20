import React, { useState, useMemo } from "react";
import { Book, SearchResult } from "../types";
import BookCard from "./BookCard";

interface BookListProps {
    books: Book[] | SearchResult[];
    onBookClick: (id: number) => void;
    displaySort?: boolean;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalBooks: number;
    isSearchMode?: boolean; // <-- Add this
}


const BookList: React.FC<BookListProps> = ({
    books,
    onBookClick,
    displaySort = false,
    currentPage,
    setCurrentPage,
    totalBooks,
    isSearchMode, // <-- Default to false
}) => {
    const [selectedSort, setSelectedSort] = useState<string>("relevance");
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const booksPerPage = 9;

    const sortedBooks = useMemo(() => {
        const validBooks = books.filter((book) => book && typeof book === "object");
        const order = sortOrder === "asc" ? 1 : -1;

        return [...validBooks].sort((a, b) => {
            if ("occurrence" in a && "occurrence" in b) {
                if (selectedSort === "relevance") {
                    if (a.occurrence === b.occurrence) {
                        if ("relevance" in a && "relevance" in b) {
                            return order * ((a.relevance ?? 0) - (b.relevance ?? 0));
                        }
                        return 0;
                    }
                    return order * ((a.occurrence ?? 0) - (b.occurrence ?? 0));
                }
            }
            if (selectedSort === "title") {
                if ("title" in a && "title" in b) {
                    return order * a.title.localeCompare(b.title);
                }
                return 0;
            } else if (selectedSort === "author") {
                if ("author" in a && "author" in b) {
                    return order * a.author.localeCompare(b.author);
                }
                return 0;
            } else if (selectedSort === "date") {
                if ("releaseDate" in a && "releaseDate" in b) {
                    return order * (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
                }
                return 0;
            }
            return 0;
        });
    }, [books, selectedSort, sortOrder]);

    const totalPages = useMemo(() => {
        return Math.ceil(totalBooks / booksPerPage);
    }, [totalBooks, sortedBooks]);


    const paginatedBooks = useMemo(() => {
        if (isSearchMode) {
            const start = (currentPage - 1) * booksPerPage;
            return sortedBooks.slice(start, start + booksPerPage); // Local pagination
        }
        return sortedBooks; // Server handles it
    }, [sortedBooks, currentPage, isSearchMode]);


    const handlePreviousPage = () => {
        setCurrentPage(Math.max(1, currentPage - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(Math.min(totalPages, currentPage + 1));
    };

    return (
        <div className="container mx-auto my-3 p-6">
            {displaySort && (
                <div>
                    <div className="flex justify-start items-center gap-6 p-4 mb-4 bg-gray-800 max-w-fit rounded-md text-white">
                        <label className="font-semibold">Sort by:</label>
                        <select
                            className="border px-2 py-1 rounded bg-gray-800"
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                        >
                            <option value="relevance">Relevance</option>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="date">Date</option>
                        </select>

                        <button
                            className="text-black border px-2 py-1 rounded bg-gray-200"
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        >
                            {sortOrder === "asc" ? "Ascending" : "Descending"}
                        </button>
                    </div>
                </div>
            )}

            <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBooks.map((book) =>
                    "id" in book ? (
                        <BookCard key={book.id} book={book} onBookClick={onBookClick} />
                    ) : null
                )}
            </div>

            {totalPages > 1 && (
                <div className="w-full flex justify-center">
                    <div className="flex justify-center items-center gap-4 mt-8 bg-gray-800 max-w-fit rounded-md p-4 text-white">
                        <button
                            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 cursor-pointer"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <span className="text-lg font-semibold">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 cursor-pointer"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookList;
