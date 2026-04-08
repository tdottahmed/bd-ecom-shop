import React, { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, X, ArrowUpDown, Search } from "lucide-react";

interface ProductFiltersProps {
    sort: string;
    setSort: (sort: string) => void;
    setIsFilterOpen: (isOpen: boolean) => void;
    filters: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
        is_preorder?: string;
        stock_out?: string;
        category_id?: string;
        brand_id?: string;
    };
    categories?: { id: number; title: string; slug: string }[];
    brands?: { id: number; title: string; slug: string }[];
    totalCount?: number;
    activeFilterCount?: number;
    onRemoveFilter?: (key: string) => void;
    onSearch?: (query: string) => void;
}

const SORT_LABELS: Record<string, string> = {
    latest: "Latest",
    price_low: "Price: Low → High",
    price_high: "Price: High → Low",
    name: "Name: A – Z",
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
    sort,
    setSort,
    setIsFilterOpen,
    filters,
    categories = [],
    brands = [],
    totalCount,
    activeFilterCount = 0,
    onRemoveFilter,
    onSearch,
}) => {
    const [searchValue, setSearchValue] = useState(filters.search ?? "");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    // Sync if filters.search changes externally (e.g. chip removal)
    useEffect(() => {
        setSearchValue(filters.search ?? "");
    }, [filters.search]);

    // Debounce search → call onSearch after 500 ms
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!onSearch) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch(searchValue.trim());
        }, 500);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchValue]);

    const hasActiveFilters =
        !!(
            filters.search ||
            filters.min_price ||
            filters.max_price ||
            filters.in_stock ||
            filters.category_id ||
            filters.brand_id ||
            filters.is_preorder ||
            filters.stock_out ||
            (filters.sort && filters.sort !== "latest")
        );

    return (
        <div>
            {/* ── Main toolbar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 px-4 sm:px-5 py-3.5">

                {/* Search input — full width on mobile, flex-1 on desktop */}
                <div className="relative flex-1 group">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors pointer-events-none"
                    />
                    <input
                        type="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search products…"
                        className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/15 transition-all"
                    />
                    {searchValue && (
                        <button
                            onClick={() => setSearchValue("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-brand-primary transition-colors"
                            aria-label="Clear search"
                        >
                            <X size={14} strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Count — desktop only */}
                    <p className="hidden lg:block text-sm text-gray-400 shrink-0 whitespace-nowrap">
                        {totalCount != null ? (
                            <>
                                <span className="font-semibold text-brand-dark">
                                    {totalCount.toLocaleString()}
                                </span>{" "}
                                item{totalCount !== 1 ? "s" : ""}
                            </>
                        ) : null}
                    </p>

                    {/* Divider */}
                    <span className="hidden lg:block h-5 w-px bg-gray-200" />

                    {/* Sort */}
                    <div className="flex items-center gap-1.5 pl-3 pr-2 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:border-brand-primary/40 hover:bg-white transition-colors group">
                        <ArrowUpDown size={14} className="text-gray-400 group-hover:text-brand-primary transition-colors shrink-0" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer pr-5 max-w-[110px] sm:max-w-none"
                        >
                            <option value="latest">Latest</option>
                            <option value="price_low">Price: Low → High</option>
                            <option value="price_high">Price: High → Low</option>
                            <option value="name">Name: A – Z</option>
                        </select>
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0 -ml-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Filter button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${
                            activeFilterCount > 0
                                ? "bg-brand-bg border-brand-primary/30 text-brand-primary hover:bg-brand-primary/15"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                    >
                        <SlidersHorizontal size={15} />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-bold leading-none">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Active filter chips ── */}
            {hasActiveFilters && (
                <div className="px-4 sm:px-5 pb-3.5 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                    {filters.search && (
                        <FilterChip
                            label={`"${filters.search}"`}
                            onRemove={onRemoveFilter ? () => onRemoveFilter("search") : undefined}
                        />
                    )}
                    {filters.min_price && (
                        <FilterChip
                            label={`Min ৳${filters.min_price}`}
                            onRemove={onRemoveFilter ? () => onRemoveFilter("min_price") : undefined}
                        />
                    )}
                    {filters.max_price && (
                        <FilterChip
                            label={`Max ৳${filters.max_price}`}
                            onRemove={onRemoveFilter ? () => onRemoveFilter("max_price") : undefined}
                        />
                    )}
                    {filters.in_stock === "true" && (
                        <FilterChip
                            label="In Stock Only"
                            onRemove={onRemoveFilter ? () => onRemoveFilter("in_stock") : undefined}
                        />
                    )}
                    {filters.is_preorder === "true" && (
                        <FilterChip
                            label="Pre-order"
                            onRemove={onRemoveFilter ? () => onRemoveFilter("is_preorder") : undefined}
                        />
                    )}
                    {filters.stock_out === "true" && (
                        <FilterChip
                            label="Include Out of Stock"
                            onRemove={onRemoveFilter ? () => onRemoveFilter("stock_out") : undefined}
                        />
                    )}
                    {filters.category_id && (
                        <FilterChip
                            label={`Category: ${
                                categories.find((c) => c.id.toString() === filters.category_id)?.title ||
                                filters.category_id
                            }`}
                            onRemove={onRemoveFilter ? () => onRemoveFilter("category_id") : undefined}
                        />
                    )}
                    {filters.brand_id && (
                        <FilterChip
                            label={`Brand: ${
                                brands.find((b) => b.id.toString() === filters.brand_id)?.title ||
                                filters.brand_id
                            }`}
                            onRemove={onRemoveFilter ? () => onRemoveFilter("brand_id") : undefined}
                        />
                    )}
                    {filters.sort && filters.sort !== "latest" && (
                        <FilterChip
                            label={`Sort: ${SORT_LABELS[filters.sort] ?? filters.sort}`}
                            onRemove={onRemoveFilter ? () => onRemoveFilter("sort") : undefined}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

const FilterChip: React.FC<{ label: string; onRemove?: () => void }> = ({ label, onRemove }) => (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-brand-bg border border-brand-primary/20 text-brand-primary text-xs font-medium">
        {label}
        {onRemove && (
            <button
                onClick={onRemove}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-brand-primary hover:text-white transition-colors"
                aria-label={`Remove ${label} filter`}
            >
                <X size={10} strokeWidth={2.5} />
            </button>
        )}
    </span>
);

export default ProductFilters;
