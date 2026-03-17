import React, {
    useRef,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { Upload, X, Eye } from "lucide-react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";
import { getAssetUrl } from "@/Utils/helpers";

interface ImageFile {
    id: string;
    file?: File;
    preview: string;
    name?: string;
    size?: string;
    isExisting?: boolean;
}

interface ImageUploaderProps {
    label?: string;
    required?: boolean;
    multiple?: boolean;
    maxFiles?: number;
    inputId?: string;
    value: File | File[] | null;
    existingImages?: string[];
    onChange: (files: File | File[] | null) => void;
    onRemoveExisting?: (path: string) => void;
    error?: string;
    accept?: string;
}

const DEFAULT_EXISTING_IMAGES: string[] = [];
const DEFAULT_VALUE_ARRAY: File[] = [];

const ImageUploader: React.FC<ImageUploaderProps> = ({
    label = "Images",
    required = false,
    multiple = true,
    maxFiles = 10,
    inputId = "image-upload",
    value,
    existingImages = DEFAULT_EXISTING_IMAGES,
    onChange,
    onRemoveExisting,
    error,
    accept = "image/*",
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<ImageFile[]>([]);

    // Format file size helper
    const formatFileSize = useCallback((bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }, []);

    // Generate unique ID for files
    const generateFileId = useCallback((file: File): string => {
        return `${file.name}-${file.size}-${file.lastModified}`;
    }, []);

    // Convert value to array for consistent handling
    const valueArray = useMemo(() => {
        if (value === null) return DEFAULT_VALUE_ARRAY;
        if (Array.isArray(value)) return value;
        return [value];
    }, [value]);

    // Update previews when value or existingImages change
    useEffect(() => {
        // Create existing image previews
        // In single mode, if we have a new file, we don't show existing images
        const showExisting = multiple || valueArray.length === 0;

        const safeExistingImages = Array.isArray(existingImages)
            ? existingImages
            : [];

        const existingPreviews: ImageFile[] = showExisting
            ? safeExistingImages.map((path) => ({
                  id: `existing-${path}`,
                  preview: path,
                  name: path.split("/").pop() || "Existing Image",
                  isExisting: true,
              }))
            : [];

        // Create new file previews
        const newFilePreviews: ImageFile[] = valueArray.map((file) => {
            const fileId = generateFileId(file);
            return {
                id: fileId,
                file,
                preview: URL.createObjectURL(file),
                name: file.name,
                size: formatFileSize(file.size),
                isExisting: false,
            };
        });

        setImagePreviews([...existingPreviews, ...newFilePreviews]);

        // Cleanup object URLs when component unmounts or files change
        return () => {
            newFilePreviews.forEach((preview) => {
                if (!preview.isExisting) {
                    URL.revokeObjectURL(preview.preview);
                }
            });
        };
    }, [valueArray, existingImages, formatFileSize, generateFileId, multiple]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) return;

        // For single mode, we don't count existing images against the limit because we'll replace it
        const currentNewFilesCount = valueArray.length;
        const currentTotal = multiple
            ? existingImages.length + currentNewFilesCount
            : files.length > 0
              ? 1
              : 0; // In single mode, result will be 1 file

        if (!multiple && files.length > 1) {
            alert("You can only upload one image");
            return;
        }

        if (
            multiple &&
            files.length + existingImages.length + currentNewFilesCount >
                maxFiles
        ) {
            alert(`You can only upload up to ${maxFiles} images in total`);
            return;
        }

        // Filter out duplicates (only relevant for multiple mode)
        const existingFileIds = new Set(valueArray.map(generateFileId));
        const newFiles = files.filter(
            (file) => !existingFileIds.has(generateFileId(file)),
        );

        if (multiple && newFiles.length === 0) {
            alert("Some files are already selected");
            return;
        }

        if (multiple) {
            // For multiple: combine existing files with new files
            const allFiles = [...valueArray, ...newFiles];
            onChange(allFiles);
        } else {
            // For single: use only the first new file (or null if none)
            onChange(newFiles.length > 0 ? newFiles[0] : null);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = (id: string, isExisting: boolean) => {
        if (isExisting) {
            // Remove existing image
            if (onRemoveExisting) {
                onRemoveExisting(id.replace("existing-", ""));
            }
        } else {
            // Remove new file
            if (multiple) {
                // For multiple: remove the specific file
                const updatedFiles = valueArray.filter(
                    (file) => generateFileId(file) !== id,
                );
                onChange(updatedFiles);
            } else {
                // For single: set to null
                onChange(null);
            }

            // Revoke the object URL
            const imageToRemove = imagePreviews.find((img) => img.id === id);
            if (imageToRemove && !imageToRemove.isExisting) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");

        const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/"),
        );

        if (files.length > 0) {
            const dt = new DataTransfer();
            files.forEach((file) => dt.items.add(file));

            if (fileInputRef.current) {
                fileInputRef.current.files = dt.files;
                handleFileSelect({ target: fileInputRef.current } as any);
            }
        }
    };

    const handleContainerClick = () => {
        fileInputRef.current?.click();
    };

    const totalFilesCount = imagePreviews.length;

    return (
        <div className="space-y-3">
            {label && (
                <InputLabel
                    htmlFor={inputId}
                    value={label}
                    required={required}
                    className="mb-2"
                />
            )}

            <div
                className={`border-2 border-dashed border-gray-800 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-[#2DE3A7] ${
                    error ? "border-red-300" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleContainerClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFileSelect}
                    className="hidden"
                    id={inputId}
                />
                <Upload className="mx-auto h-12 w-12 text-white-400" />
                <div className="mt-2">
                    <p className="text-sm font-medium text-white">
                        Drop {multiple ? "images" : "an image"} here or click to
                        upload
                    </p>
                    <p className="text-xs text-white">
                        {totalFilesCount} / {maxFiles} files selected
                        {existingImages.length > 0 &&
                            ` (${existingImages.length} existing)`}
                    </p>
                    {!multiple && totalFilesCount > 0 && (
                        <p className="text-xs text-orange-600 mt-1">
                            Selecting a new image will replace the current one
                        </p>
                    )}
                </div>
            </div>

            {error && <InputError message={error} />}

            {imagePreviews.length > 0 && (
                <div
                    className={`grid gap-4 mt-4 ${
                        multiple
                            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            : "grid-cols-1 max-w-xs"
                    }`}
                >
                    {imagePreviews.map((image) => (
                        <div
                            key={image.id}
                            className="relative group overflow-hidden border-2 border-dashed border-gray-700 rounded-lg p-2 lg:p-8 text-center hover:border-[#2DE3A7] transition-colors"
                        >
                            <img
                                src={
                                    image.file
                                        ? image.preview
                                        : getAssetUrl(image.preview)
                                }
                                alt={image.name || "Image"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />

                            <div className="absolute inset-0 bg-[#0E1614]/90 rounded-lg p-6 border border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="text-white text-center">
                                    {image.isExisting ? (
                                        <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                                            Existing
                                        </span>
                                    ) : (
                                        <p className="text-xs">
                                            {" "}
                                            {image.size}{" "}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const imageUrl = image.isExisting
                                            ? getAssetUrl(image.preview)
                                            : image.preview;
                                        window.open(imageUrl, "_blank");
                                    }}
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    title="View image"
                                >
                                    <Eye size={12} />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(
                                            image.id,
                                            !!image.isExisting,
                                        );
                                    }}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    title="Remove image"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
