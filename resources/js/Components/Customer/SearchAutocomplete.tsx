import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@inertiajs/react";
import { Search, X, ArrowRight, Package } from "lucide-react";
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
    isOverlay?: boolean;
    autoFocus?: boolean;
    onClose?: () => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
    isMobile = false,
    isOverlay = false,
    autoFocus = false,
    onClose,
}) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close on outside click
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
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Cmd+K / Ctrl+K to focus (desktop only)
    useEffect(() => {
        if (isMobile) return;
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isMobile]);

    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.trim().length < 2) {
                setResults([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.get<SearchResult[]>("/api/search", {
                    params: { q: searchQuery },
                });
                setResults(response.data);
                setIsOpen(true);
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [],
    );

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            setSelectedIndex(-1);
            inputRef.current?.blur();
            return;
        }
        if (!isOpen || results.length === 0) return;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : prev,
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    window.location.href = `/product/${results[selectedIndex].slug}`;
                }
                break;
        }
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    };

    const closeDropdown = () => {
        setIsOpen(false);
        onClose?.();
    };

    const showDropdown = isOpen && query.length >= 2;

    return (
        <div ref={searchRef} className="relative w-full">
            {/* Input */}
            <div className="relative group">
                <Search
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-500 transition-colors pointer-events-none ${isMobile || isOverlay ? "h-5 w-5" : "h-4 w-4"}`}
                />
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className={`w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-900/8 outline-none transition-all placeholder-gray-400 text-gray-900 ${
                        isMobile
                            ? "pl-11 pr-10 py-3.5 rounded-xl text-base"
                            : isOverlay
                            ? "pl-12 pr-10 py-4 rounded-xl text-base"
                            : "pl-10 py-2 rounded-full text-sm pr-20"
                    }`}
                    placeholder={
                        isMobile || isOverlay
                            ? "Search products, brands…"
                            : "Search…"
                    }
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoFocus={isMobile || autoFocus}
                />
                {/* ⌘K shortcut badge — desktop only, hidden when typing */}
                {!isMobile && !query && (
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded-md pointer-events-none select-none shadow-sm">
                        <span className="text-[11px]">⌘</span>K
                    </kbd>
                )}
                {/* Clear button */}
                {/* {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )} */}
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    className={`absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border border-gray-100/80 overflow-hidden flex flex-col ${
                        isMobile ? "max-h-[65vh]" : "max-h-[420px]"
                    }`}
                >
                    {/* Skeleton loading */}
                    {isLoading && (
                        <div className="p-3 space-y-1">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 px-3 py-2.5 animate-pulse"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                                        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <Package className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                No results for &ldquo;{query}&rdquo;
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Try different keywords or browse categories
                            </p>
                        </div>
                    )}

                    {/* Results list */}
                    {!isLoading && results.length > 0 && (
                        <>
                            <div className="overflow-y-auto flex-1">
                                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                                    Products
                                </p>
                                <ul className="px-1.5 pb-1.5">
                                    {results.map((product, index) => (
                                        <li key={product.id}>
                                            <Link
                                                href={`/product/${product.slug}`}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group/item ${
                                                    index === selectedIndex
                                                        ? "bg-gray-100"
                                                        : "hover:bg-gray-50"
                                                }`}
                                                onClick={closeDropdown}
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={getAssetUrl(
                                                            product.image,
                                                        )}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate leading-snug">
                                                        {product.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {formatPrice(
                                                                product.price,
                                                            )}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                                                                product.in_stock
                                                                    ? "text-brand-success"
                                                                    : "text-red-500"
                                                            }`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                                    product.in_stock
                                                                        ? "bg-brand-success"
                                                                        : "bg-red-400"
                                                                }`}
                                                            />
                                                            {product.in_stock
                                                                ? "In stock"
                                                                : "Out of stock"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover/item:text-gray-500 flex-shrink-0 transition-colors" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer: view all */}
                            <div className="border-t border-gray-100 p-2">
                                <Link
                                    href={route('products.index', { search: query })}
                                    className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group/footer"
                                    onClick={closeDropdown}
                                >
                                    <span className="text-sm font-medium text-gray-600">
                                        See all results for{" "}
                                        <span className="text-gray-900 font-semibold">
                                            &ldquo;{query}&rdquo;
                                        </span>
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover/footer:text-gray-700 transition-colors" />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchAutocomplete;
