import React from "react";
import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
    onClick: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-2 rounded-lg text-brand-dark hover:text-brand-primary hover:bg-brand-bg transition-colors"
            aria-label="Open menu"
        >
            <Menu size={22} />
        </button>
    );
};

export default MobileMenuButton;
