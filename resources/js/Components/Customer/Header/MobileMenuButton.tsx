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
            className="p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
        >
            <Menu size={24} />
        </button>
    );
};

export default MobileMenuButton;
