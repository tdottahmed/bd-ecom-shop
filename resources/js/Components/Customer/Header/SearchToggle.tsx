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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-full transition-colors text-sm border border-white/10"
            aria-label="Open search"
        >
            <Search size={16} strokeWidth={2.2} />
        </button>
    );
};

export default SearchToggle;
