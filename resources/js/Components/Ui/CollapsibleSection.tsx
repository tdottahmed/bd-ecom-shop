import { useState } from "react";

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
    defaultOpen = false,
}) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-700 rounded-lg">
            {/* Header */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-4 py-3
                           text-left font-medium text-gray-200
                           hover:bg-gray-800
                           transition-all duration-200"
            >
                <span>{title}</span>

                {/* Icon */}
                <svg
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Content */}
            <div
                className={`grid transition-all duration-300 overflow-hidden
                    ${
                        open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                    }
                `}
            >
                <div className="px-4 py-3 overflow-hidden text-gray-700 dark:text-gray-300">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CollapsibleSection;
