import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    processing?: boolean;
}

export default function AuthButton({
    className = '',
    disabled,
    processing,
    children,
    ...props
}: AuthButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || processing}
            className={`
                w-full inline-flex justify-center items-center px-6 py-4 
                bg-[#0C1311] text-white font-semibold text-base rounded-[1.25rem]
                hover:bg-[#1E2826] focus:bg-[#1E2826] focus:outline-none 
                focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 
                transition-all duration-300 ease-in-out shadow-sm
                disabled:opacity-75 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {processing ? (
                <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" />
                    {children}
                </>
            ) : (
                children
            )}
        </button>
    );
}
