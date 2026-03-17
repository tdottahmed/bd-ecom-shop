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
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <svg
                        className="w-1/3 h-1/3 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
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
