import React, { forwardRef } from "react";

interface TextAreaProps {
    id: string;
    name: string;
    value: string;
    className?: string;
    autoComplete?: string;
    placeholder?: string;
    isFocused?: boolean;
    required?: boolean;
    rows?: number;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            id,
            name,
            value,
            className = "",
            autoComplete,
            placeholder,
            isFocused = false,
            required = false,
            rows = 4,
            disabled = false,
            onChange,
        },
        ref
    ) => {
        const textareaRef = React.useRef<HTMLTextAreaElement>(null);

        React.useEffect(() => {
            if (isFocused && textareaRef.current) {
                textareaRef.current.focus();
            }
        }, [isFocused]);

        return (
            <textarea
                id={id}
                ref={ref || textareaRef}
                name={name}
                value={value}
                placeholder={placeholder}
                required={required}
                rows={rows}
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
                    resize-vertical
                    min-h-[100px]
                    ${className}
                `}
                autoComplete={autoComplete ?? "off"}
                onChange={onChange}
                disabled={disabled}
            />
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;
