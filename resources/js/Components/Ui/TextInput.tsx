import React, { forwardRef } from "react";

interface TextInputProps {
    id: string;
    name: string;
    value: string;
    type?: string;
    className?: string;
    autoComplete?: string;
    placeholder?: string;
    isFocused?: boolean;
    required?: boolean;
    step?: string;
    disabled?: boolean;
    min?: string | number;
    max?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            id,
            type = "text",
            name,
            value,
            className = "",
            autoComplete,
            placeholder,
            isFocused = false,
            required = false,
            step,
            disabled = false,
            min,
            max,
            onChange,
        },
        ref,
    ) => {
        const inputRef = React.useRef<HTMLInputElement>(null);

        React.useEffect(() => {
            if (isFocused && inputRef.current) {
                inputRef.current.focus();
            }
        }, [isFocused]);

        return (
            <input
                id={id}
                ref={ref || inputRef}
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                required={required}
                className={`
                    w-full px-4 py-3 
                    bg-[#0F1A18] border border-[#1E2826] 
                    rounded-lg 
                    text-gray-100 placeholder-gray-500
                    focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]
                    transition-all duration-200 ease-in-out
                    ${
                        disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                    }
                    ${className}
                `}
                autoComplete={autoComplete ?? "off"}
                onChange={onChange}
                step={step}
                disabled={disabled}
            />
        );
    },
);

export default TextInput;
