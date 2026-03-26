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
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
        >
            <Search size={24} />
        </button>
    );
};

export default SearchToggle;
