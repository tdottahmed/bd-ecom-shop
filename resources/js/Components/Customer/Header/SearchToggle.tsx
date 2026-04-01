import React from "react";
import { Search } from "lucide-react";

interface SearchToggleProps {
    onClick: () => void;
}

const SearchToggle: React.FC<SearchToggleProps> = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 pl-3 pr-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full transition-colors text-sm"
            aria-label="Open search"
        >
            <Search size={16} strokeWidth={2.2} />
            <span className="text-sm text-gray-400 font-normal hidden xs:inline">Search…</span>
        </button>
    );
};

export default SearchToggle;
