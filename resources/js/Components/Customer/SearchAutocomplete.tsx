import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@inertiajs/react";
import { Search, X } from "lucide-react";
import axios from "axios";
import { debounce } from "@/Utils/helpers";
import { getAssetUrl, formatPrice } from "@/Utils/helpers";
import Image from "../Ui/Image";

interface SearchResult {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    stock: number;
    in_stock: boolean;
}

interface SearchAutocompleteProps {
    isMobile?: boolean;
    onClose?: () => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
    isMobile = false,
    onClose,
}) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    //Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.trim().length < 2) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await axios.get<SearchResult[]>(
                    "/api/search",
                    {
                        params: { q: searchQuery },
                    }
                );
                setResults(response.data);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    // Handle input change
    const handleInputChange = (value: string) => {
        setQuery(value);
        setSelectedIndex(-1);

        if (value.trim().length >= 2) {
            setIsLoading(true);
            debouncedSearch(value);
        } else {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Escape":
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    const product = results[selectedIndex];
                    window.location.href = `/product/${product.slug}`;
                }
                break;
        }
    };

    // Clear search
    const handleClear = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    };

    return (
        <div ref={searchRef} className={`relative ${isMobile ? "w-full" : ""}`}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    id={isMobile ? "mobile-search" : "desktop-search"}
                    name="search"
                    type="search"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className={`block w-full pl-10 ${
                        query ? "pr-10" : "pr-3"
                    } ${
                        isMobile ? "py-3" : "py-2"
                    } border border-gray-300 rounded-${
                        isMobile ? "lg" : "full"
                    } leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isMobile ? "text-base" : "text-sm"
                    } transition duration-150 ease-in-out`}
                    placeholder="Search products..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoFocus={isMobile}
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (query.length >= 2 || results.length > 0) && (
                <div
                    className={`absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto ${
                        isMobile ? "max-h-[70vh]" : ""
                    }`}
                >
                    {isLoading && (
                        <div className="p-4 text-center text-gray-500">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600">
                                {" "}
                            </div>
                            <p className="mt-2 text-sm"> Searching...</p>
                        </div>
                    )}

                    {!isLoading &&
                        results.length === 0 &&
                        query.length >= 2 && (
                            <div className="p-4 text-center text-gray-500">
                                <p>No products found for "{query}" </p>
                            </div>
                        )}

                    {!isLoading && results.length > 0 && (
                        <ul className="py-2">
                            {results.map((product, index) => (
                                <li key={product.id}>
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                                            index === selectedIndex
                                                ? "bg-indigo-50"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setIsOpen(false);
                                            onClose?.();
                                        }}
                                    >
                                        <Image
                                            src={getAssetUrl(product.image)}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-semibold text-indigo-600">
                                                    {formatPrice(product.price)}
                                                </span>
                                                {product.in_stock ? (
                                                    <span className="text-xs text-green-600">
                                                        In Stock
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-red-600">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!isLoading && results.length > 0 && (
                        <div className="border-t border-gray-200 p-3 bg-gray-50">
                            <Link
                                href={`/search?search=${encodeURIComponent(
                                    query
                                )}`}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                onClick={() => {
                                    setIsOpen(false);
                                    onClose?.();
                                }}
                            >
                                View all results for "{query}"
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchAutocomplete;
