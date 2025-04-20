import React from 'react'
import SearchBar from './SearchBar'
import BookList from './BookList'
import { Book, SearchResult } from '../types'

interface MainProps {
    loading: boolean
    Spinner: React.FC
    handleSearch: (results: SearchResult[]) => void
    searchResults: SearchResult[]
    books: Book[]
    currentPage: number
    setCurrentPage: (page: number) => void
    totalBooks: number
    isSearchMode?: boolean
}

const Main = ({ loading, Spinner, handleSearch, searchResults, books, currentPage, setCurrentPage, totalBooks, isSearchMode }: MainProps) => {
    return (
        <div className="min-w-full flex flex-col items-center justify-center">
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="min-w-full bg-gray-800 flex flex-col items-center justify-center">
                        <div className="w-[80%]">
                            <SearchBar onSearch={handleSearch} />
                        </div>
                    </div>
                    <div className="container mx-auto my-4 p-4">
                        <BookList
                            books={searchResults.length > 0 ? searchResults : books}
                            onBookClick={(id) => (window.location.href = `/book/${id}`)}
                            displaySort={true}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalBooks={totalBooks}
                            isSearchMode={isSearchMode}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default Main