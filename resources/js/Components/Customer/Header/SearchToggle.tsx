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
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-bg hover:bg-brand-primary/15 text-brand-dark hover:text-brand-primary rounded-full transition-colors text-sm"
            aria-label="Open search"
        >
            <Search size={16} strokeWidth={2.2} />
        </button>
    );
};

export default SearchToggle;
