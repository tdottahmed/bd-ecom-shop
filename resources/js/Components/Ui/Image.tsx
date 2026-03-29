import { filePath, handleImageError } from "@/Utils/helpers";
import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt: string;
    baseUrl?: string;
    fallback?: string;
    lazy?: boolean;
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    baseUrl = "",
    fallback,
    lazy = true,
    className = "",
    onError,
    ...props
}) => {
    const fullSrc = filePath(src, baseUrl);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);

    const handleError = (
        event: React.SyntheticEvent<HTMLImageElement, Event>,
    ) => {
        setIsLoading(false);
        setHasError(true);
        if (onError) {
            onError(event);
        } else {
            handleImageError(event, fallback);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 overflow-hidden z-10">
                    {/* Soft animated background tint */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/50 to-fuchsia-50/80 animate-pulse" />
                    
                    {/* Premium Colorful Spinner */}
                    <div className="relative flex items-center justify-center drop-shadow-sm scale-75 sm:scale-100">
                        {/* Static Track */}
                        <div className="absolute w-10 h-10 rounded-full border-[3px] border-slate-200" />
                        {/* Animated gradient ring */}
                        <div className="w-10 h-10 rounded-full border-[3px] border-transparent border-t-indigo-600 border-r-fuchsia-500 border-b-rose-400 animate-[spin_1s_linear_infinite]" />
                    </div>
                </div>
            )}
            <img
                src={fullSrc}
                alt={alt}
                loading={lazy ? "lazy" : "eager"}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                    isLoading ? "opacity-0" : "opacity-100"
                }`}
                onError={handleError}
                onLoad={handleLoad}
                {...props}
            />
        </div>
    );
};

export default Image;
