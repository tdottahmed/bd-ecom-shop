import React from "react";
import { ShoppingCart } from "lucide-react";

interface CartIconProps {
    count: number;
    className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ count, className = "" }) => {
    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
        >
            <ShoppingCart size={22} />
            {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {count}
                </span>
            )}
        </div>
    );
};

export default CartIcon;
