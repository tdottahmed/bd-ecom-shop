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
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
        >
            <Menu size={22} />
        </button>
    );
};

export default MobileMenuButton;
