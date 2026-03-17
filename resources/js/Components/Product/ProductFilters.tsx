import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Filter, Grid3X3, List } from "lucide-react";
import Search from "@/Components/Ui/Search";
import SelectInput from "@/Components/Ui/SelectInput";
import { Brand, Category, Supplier } from "@/types";

interface ProductFiltersProps {
    filters: {
        search?: string;
        category?: string;
        brand?: string;
        supplier?: string;
        sort?: string;
    };
    categories: Category[];
    brands: Brand[];
    suppliers: Supplier[];
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    filters,
    categories,
    brands,
    suppliers,
    viewMode,
    setViewMode,
}) => {
    const [showFilters, setShowFilters] = useState(false);

    // Form state mirrors the current filters
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || "all"
    );
    const [selectedBrand, setSelectedBrand] = useState(
        filters.brand || "all"
    );
    const [selectedSupplier, setSelectedSupplier] = useState(
        filters.supplier || "all"
    );
    const [sortOrder, setSortOrder] = useState(filters.sort || "newest");

    // Sync state with props when they change (e.g. after clear filters)
    useEffect(() => {
        setSearchTerm(filters.search || "");
        setSelectedCategory(filters.category || "all");
        setSelectedBrand(filters.brand || "all");
        setSelectedSupplier(filters.supplier || "all");
        setSortOrder(filters.sort || "newest");
    }, [filters]);

    // Active search with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || "")) {
                handleSearch(searchTerm);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearch = (value: string) => {
        router.get(
            route("admin.products.index"),
            {
                search: value || undefined,
                category:
                    selectedCategory !== "all" ? selectedCategory : undefined,
                brand: selectedBrand !== "all" ? selectedBrand : undefined,
                supplier:
                    selectedSupplier !== "all" ? selectedSupplier : undefined,
                sort: sortOrder,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const handleFilterChange = (filterType: string, value: string) => {
        const newFilters: any = {
            search: searchTerm || undefined,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            brand: selectedBrand !== "all" ? selectedBrand : undefined,
            supplier: selectedSupplier !== "all" ? selectedSupplier : undefined,
            sort: sortOrder,
        };

        if (filterType === "category") {
            setSelectedCategory(value);
            newFilters.category = value !== "all" ? value : undefined;
        } else if (filterType === "brand") {
            setSelectedBrand(value);
            newFilters.brand = value !== "all" ? value : undefined;
        } else if (filterType === "supplier") {
            setSelectedSupplier(value);
            newFilters.supplier = value !== "all" ? value : undefined;
        } else if (filterType === "sort") {
            setSortOrder(value);
            newFilters.sort = value;
        }

        router.get(route("admin.products.index"), newFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <div className="flex-grow">
                    <Search
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSubmit={handleSearch}
                        placeholder="Search products..."
                        className="w-full"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg border transition-colors flex-shrink-0 ${
                        showFilters
                            ? "bg-emerald-50 bg-emerald-900/20 text-emerald-400"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                    }`}
                >
                    <Filter size={20} />
                </button>
                <div className="hidden md:flex bg-gray-800 rounded-lg p-1 flex-shrink-0">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                            viewMode === "grid"
                                ? "bg-gray-700 shadow-sm text-emerald-400"
                                : "text-gray-400 hover:text-gray-300"
                        }`}
                    >
                        <Grid3X3 size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                            viewMode === "list"
                                ? "bg-gray-700 shadow-sm text-emerald-400"
                                : "text-gray-400 hover:text-gray-300"
                        }`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    showFilters
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-800/50 rounded-lg mb-1">
                        <SelectInput
                            value={sortOrder}
                            onChange={(value) =>
                                handleFilterChange("sort", value)
                            }
                            options={[
                                {
                                    value: "newest",
                                    label: "Newest First",
                                },
                                {
                                    value: "oldest",
                                    label: "Oldest First",
                                },
                                {
                                    value: "price_low",
                                    label: "Price: Low to High",
                                },
                                {
                                    value: "price_high",
                                    label: "Price: High to Low",
                                },
                            ]}
                            className="w-full"
                        />
                        <SelectInput
                            value={selectedCategory}
                            onChange={(value) =>
                                handleFilterChange("category", value)
                            }
                            options={[
                                {
                                    value: "all",
                                    label: "All Categories",
                                },
                                ...categories.map((c) => ({
                                    value: c.id.toString(),
                                    label: c.title,
                                })),
                            ]}
                            className="w-full"
                        />
                        <SelectInput
                            value={selectedBrand}
                            onChange={(value) =>
                                handleFilterChange("brand", value)
                            }
                            options={[
                                {
                                    value: "all",
                                    label: "All Brands",
                                },
                                ...brands.map((b) => ({
                                    value: b.id.toString(),
                                    label: b.title,
                                })),
                            ]}
                            className="w-full"
                        />
                        <SelectInput
                            value={selectedSupplier}
                            onChange={(value) =>
                                handleFilterChange("supplier", value)
                            }
                            options={[
                                {
                                    value: "all",
                                    label: "All Suppliers",
                                },
                                ...suppliers.map((s) => ({
                                    value: s.id.toString(),
                                    label: s.name,
                                })),
                            ]}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
