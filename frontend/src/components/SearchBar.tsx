import React, { useState } from "react";
import axios from "axios";
import { SearchResult } from "../types";

interface SearchBarProps {
    onSearch: (results: SearchResult[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [pattern, setPattern] = useState("");
    const [type, setType] = useState<"keyword" | "regex" | "kmp">("keyword");
    const [totalBooks, setTotalBooks] = useState(0);

    const handleSearch = async (query: string, searchType: "keyword" | "regex" | "kmp") => {
        if (query.length <= 3) {
            return;
        }

        // Debounce the search to avoid too many requests
        if (query.length > 30) {
            query = query.slice(0, 30); // Limit the length of the search pattern
        }

        if (!query.trim()) {
            onSearch([]); // Clear results if input is empty
            return;
        }

        try {
            const response = await axios.post<SearchResult[]>(`${import.meta.env.VITE_API_URL}/api/books/search-books`, {
                pattern: query,
                type: searchType,
            });
            onSearch(response.data);
            setTotalBooks(response.data.length);
        } catch (error) {
            console.error("Error searching books:", error);
        }
    };

    return (
        <div className="min-w-full">
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Enter search pattern"
                    style={{ color: "white" }}
                    value={pattern}
                    onChange={(e) => {
                        const newPattern = e.target.value;
                        setPattern(newPattern);
                        handleSearch(newPattern, type);
                    }}
                    className="flex-grow p-2 border border-gray-300 rounded-lg"
                />
                <select
                    value={type}
                    onChange={(e) => {
                        const newType = e.target.value as "keyword" | "regex" | "kmp";
                        setType(newType);
                        handleSearch(pattern, newType);
                    }}
                    className="p-2 border border-gray-300 rounded-lg text-white bg-gray-800"
                >
                    <option value="keyword">Keyword</option>
                    <option value="regex">Regex</option>
                    <option value="kmp">KMP</option>
                </select>

            </div>
            {totalBooks > 0 && totalBooks < 1500 &&
                <div className="text-white text-2xl font-extrabold mb-4">
                    {totalBooks} book{totalBooks !== 1 ? "s" : ""} found
                </div>
            }
        </div>
    );
};

export default SearchBar;
