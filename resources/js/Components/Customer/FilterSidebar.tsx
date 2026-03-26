import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { X, SlidersHorizontal, Check } from "lucide-react";

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
        category_id?: string;
        brand_id?: string;
    };
    categories?: { id: number; title: string; slug: string }[];
    brands?: { id: number; title: string; slug: string }[];
    onApply: (params: Record<string, string>) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    isOpen,
    onClose,
    filters,
    categories = [],
    brands = [],
    onApply,
}) => {
    const [minPrice, setMinPrice] = useState(filters.min_price || "");
    const [maxPrice, setMaxPrice] = useState(filters.max_price || "");
    const [sort, setSort] = useState(filters.sort || "latest");
    const [inStock, setInStock] = useState(filters.in_stock === "true");
    const [categoryId, setCategoryId] = useState(filters.category_id || "");
    const [brandId, setBrandId] = useState(filters.brand_id || "");

    const applyFilters = () => {
        const params: Record<string, string> = {};

        if (filters.search) params.search = filters.search;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (sort !== "latest") params.sort = sort;
        if (inStock) params.in_stock = "true";
        if (categoryId) params.category_id = categoryId;
        if (brandId) params.brand_id = brandId;

        onApply(params);
        onClose();
    };

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setSort("latest");
        setInStock(false);
        setCategoryId("");
        setBrandId("");

        onApply(filters.search ? { search: filters.search } : {});
        onClose();
    };

    return (
        <>
        {/* Backdrop */ }
        < div
                className = {`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`
}
onClick = { onClose }
    />

    {/* Sidebar */ }
    < div
className = {`fixed inset-y-0 left-0 max-w-sm w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
            >
    <div className="flex flex-col h-full" >
        {/* Header */ }
        < div className = "flex items-center justify-between p-6 border-b border-gray-100" >
            <div className="flex items-center gap-3" >
                <div className="p-2 bg-gray-100 rounded-lg" >
                    <SlidersHorizontal className="w-5 h-5 text-gray-900" />
                        </div>
                        < h2 className = "text-xl font-bold text-gray-900" >
                            Filters
                            </h2>
                            </div>
                            < button
onClick = { onClose }
className = "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
    >
    <X size={ 20 } />
        </button>
        </div>

{/* Filter Content */ }
<div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar" >
    {/* Sort Options */ }
    < div >
    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider" >
        Sort By
            </h3>
            < div className = "flex flex-wrap gap-2" >
            {
                [
                { value: "latest", label: "Latest" },
                {
                    value: "price_low",
                    label: "Price: Low to High",
                },
                {
                    value: "price_high",
                    label: "Price: High to Low",
                },
                { value: "name", label: "Name: A to Z" },
                                ].map((option) => (
                    <button
                                        key= { option.value }
                                        onClick = {() => setSort(option.value)}
className = {`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${sort === option.value
        ? "bg-gray-900 text-white border-gray-900 shadow-md"
        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    }`}
                                    >
    { option.label }
    </button>
                                ))}
</div>
    </div>

{/* Price Range */ }
<div className="border-t border-gray-100 pt-8" >
    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider" >
        Price Range
            </h3>
            < div className = "grid grid-cols-2 gap-4" >
                <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5" >
                    Min Price
                        </label>
                        < div className = "relative" >
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium" >
                                            ৳
</span>
    < input
type = "number"
value = { minPrice }
onChange = {(e) =>
setMinPrice(e.target.value)
                                            }
placeholder = "0"
className = "w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
    />
    </div>
    </div>
    < div >
    <label className="block text-xs font-medium text-gray-500 mb-1.5" >
        Max Price
            </label>
            < div className = "relative" >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium" >
                                            ৳
</span>
    < input
type = "number"
value = { maxPrice }
onChange = {(e) =>
setMaxPrice(e.target.value)
                                            }
placeholder = "10000"
className = "w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
    />
    </div>
    </div>
    </div>
    </div>

{/* Stock Status */ }
<div className="border-t border-gray-100 pt-8" >
    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider" >
        Availability
        </h3>
        < label className = "flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 group" >
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900" >
                In Stock Only
                    </span>
                    < div
className = {`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-200 ${inStock
        ? "bg-gray-900 border-gray-900"
        : "bg-white border-gray-300"
    }`}
                                >
    <input
                                        type="checkbox"
checked = { inStock }
onChange = {(e) =>
setInStock(e.target.checked)
                                        }
className = "hidden"
    />
    { inStock && (
        <Check
                                            size={ 14 }
className = "text-white"
    />
                                    )}
</div>
    </label>
    </div>
    </div>

{/* Footer */ }
<div className="border-t border-gray-100 p-6 space-y-3 bg-white" >
    <button
                            onClick={ applyFilters }
className = "w-full bg-gray-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-200 active:scale-[0.98]"
    >
    Apply Filters
        </button>
        < button
onClick = { clearFilters }
className = "w-full bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]"
    >
    Clear All
        </button>
        </div>
        </div>
        </div>
        </>
    );
};

export default FilterSidebar;
