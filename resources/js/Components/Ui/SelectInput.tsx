import React, { useState, useRef, useMemo, useEffect } from "react";
import {
    useFloating,
    offset,
    flip,
    shift,
    autoUpdate,
    useInteractions,
    useClick,
    useDismiss,
    useRole,
    FloatingPortal,
    FloatingFocusManager,
    size,
} from "@floating-ui/react";
import { Transition } from "@headlessui/react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface Option {
    value: string | number;
    label: string;
}

interface SelectInputProps {
    id?: string;
    name?: string;
    value: string | number | null;
    options: Option[];
    placeholder?: string;
    onChange: (value: any) => void;
    error?: string;
    isSearchable?: boolean;
    className?: string;
}

export default function SelectInput({
    id,
    name,
    value,
    options,
    onChange,
    placeholder = "Select...",
    error,
    isSearchable = false,
    className = "",
}: SelectInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Clear search automatically when closed
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("");
        }
    }, [isOpen]);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: "bottom-start",
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(8),
            flip({ padding: 12 }),
            shift({ padding: 12 }),
            size({
                apply({ rects, elements }) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                    });
                },
            }),
        ],
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        const q = searchQuery.toLowerCase();
        return options.filter((opt) => opt.label.toLowerCase().includes(q));
    }, [options, searchQuery]);

    const selectedOption = useMemo(() => {
        if (value === null || value === undefined || value === "") return null;
        return options.find((opt) => opt.value.toString() === value.toString()) || null;
    }, [value, options]);

    return (
        <div className={`relative ${className}`}>
            {name && <input type="hidden" name={name} value={value ?? ""} id={id} />}

            <button
                ref={refs.setReference}
                {...getReferenceProps()}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 min-h-[48px] bg-[#0C1311] border rounded-xl transition-all duration-300 text-left outline-none
                    ${
                        isOpen
                            ? "border-[#2DE3A7] ring-2 ring-[#2DE3A7]/15"
                            : "border-[#1E2826] hover:border-[#3b4744]"
                    }
                    ${error ? "border-red-500/50" : ""}
                    ${isOpen ? "shadow-[0_0_0_2px_rgba(45,227,167,0.15)]" : "shadow-sm"}
                `}
            >
                <div className="flex flex-1 items-center gap-2 overflow-hidden w-full pl-1">
                    {selectedOption ? (
                        <span className="text-[#FFFFFF] text-[15px] font-medium truncate py-1">
                            {selectedOption.label}
                        </span>
                    ) : (
                        <span className="text-[#7E8C89] text-[15px] truncate py-1">
                            {placeholder}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {selectedOption && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="p-1.5 rounded-md hover:bg-[#1A2522] text-gray-500 hover:text-red-400 transition-colors cursor-pointer flex items-center justify-center group"
                        >
                            <X className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </div>
                    )}
                    <div
                        className={`flex items-center justify-center p-1 rounded-md text-gray-500 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-[#2DE3A7]" : ""
                        }`}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
            </button>

            {error && (
                <p className="text-red-500/90 text-[13.5px] font-medium mt-2 flex items-center gap-1.5 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {error}
                </p>
            )}

            <FloatingPortal>
                {isOpen && (
                    <FloatingFocusManager
                        context={context}
                        modal={false}
                        initialFocus={isSearchable ? searchInputRef : -1}
                        returnFocus={true}
                    >
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
                            className="z-[9999] outline-none"
                        >
                            <Transition
                                as="div"
                                show={isOpen}
                                appear={true}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-2 scale-95"
                                enterTo="opacity-100 translate-y-0 scale-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0 scale-100"
                                leaveTo="opacity-0 translate-y-2 scale-95"
                                className="bg-[#0A100E] border border-[#1E2826] rounded-xl shadow-[0_12px_45px_-5px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
                            >
                                {isSearchable && (
                                    <div className="p-3 border-b border-[#1E2826]/70 bg-[#0A100E] z-10">
                                        <div className="relative flex items-center">
                                            <Search
                                                className="w-4 h-4 text-gray-400 absolute left-3.5"
                                                strokeWidth={2.5}
                                            />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search options..."
                                                className="w-full bg-[#131E1B] text-white placeholder:text-gray-500 text-[14.5px] rounded-lg py-2.5 pl-10 pr-4 border border-[#1E2826] focus:border-[#2DE3A7]/50 focus:ring-1 focus:ring-[#2DE3A7]/50 transition-all outline-none"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSearchQuery("")}
                                                    className="absolute right-3.5 text-gray-500 hover:text-gray-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="max-h-[280px] overflow-y-auto p-2 custom-scrollbar focus:outline-none">
                                    {filteredOptions.length === 0 ? (
                                        <div className="py-8 flex flex-col items-center justify-center text-center">
                                            <Search className="w-8 h-8 text-gray-600 mb-3" strokeWidth={1.5} />
                                            <p className="text-[#7E8C89] text-[14.5px] font-medium">
                                                No matches found
                                            </p>
                                            <p className="text-gray-600 text-[13px] mt-1">
                                                Try adjusting your search
                                            </p>
                                        </div>
                                    ) : (
                                        filteredOptions.map((opt) => {
                                            const isSelected = selectedOption?.value === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    {...getItemProps({
                                                        onClick: () => {
                                                            onChange(opt.value);
                                                            setIsOpen(false);
                                                        },
                                                    })}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 my-[2px] rounded-[10px] text-left transition-all duration-150 group text-[14.5px] outline-none
                                                        ${
                                                            isSelected
                                                                ? "bg-[#2DE3A7]/10 text-[#2DE3A7] font-medium"
                                                                : "text-[#B0BBB8] hover:bg-[#16201D] focus:bg-[#1A2522] hover:text-white focus:text-white"
                                                        }
                                                    `}
                                                >
                                                    <span className="truncate pr-4 leading-relaxed">
                                                        {opt.label}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#2DE3A7]/20 flex-shrink-0">
                                                            <Check
                                                                className="w-3.5 h-3.5 text-[#2DE3A7]"
                                                                strokeWidth={3}
                                                            />
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </Transition>
                        </div>
                    </FloatingFocusManager>
                )}
            </FloatingPortal>
        </div>
    );
}
