import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
    error?: string;
}

export default forwardRef(function AuthTextInput(
    { type = "text", className = "", isFocused = false, error, ...props }: Props,
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="w-full relative">
            <div className="relative flex items-center">
                <input
                    {...props}
                    type={inputType}
                    className={`
                        w-full rounded-2xl bg-[#F4F6F8] border-none px-5 py-4 
                        text-gray-900 placeholder-gray-400 font-medium text-sm
                        focus:ring-2 focus:ring-[#2DE3A7]/50 focus:bg-white transition-all
                        ${isPassword ? "pr-12" : ""}
                        ${error ? "ring-2 ring-red-500/50 bg-red-50" : ""}
                        ${className}
                    `}
                    ref={localRef}
                />
                
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});
