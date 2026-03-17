import React from "react";

interface CheckboxProps {
    id?: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, name, checked, onChange }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                className="hidden"
            />
            <div
                className={`
                w-5 h-5 border-2 rounded 
                transition-all duration-200 ease-in-out
                flex items-center justify-center
                ${
                    checked
                        ? "bg-[#2DE3A7] border-[#2DE3A7]"
                        : "bg-[#0F1A18] border-[#1E2826] hover:border-[#2DE3A7]"
                }
            `}
            >
                {checked && (
                    <svg
                        className="w-3 h-3 text-[#0C1311]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
            </div>
        </label>
    );
};

export default Checkbox;
