/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: USD)
 * @param locale - Locale string (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
    amount: number | string | null | undefined,
    currency: string = "BDT",
    locale: string = "en-BD"
): string => {
    if (amount === null || amount === undefined || amount === "") {
        return "N/A";
    }

    const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return "Invalid amount";
    }

    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numericAmount);
    } catch (error) {
        return `৳ ${numericAmount.toFixed(0)}`;
    }
};

/**
 * Format a number as price with BDT currency symbol
 * @param amount - The amount to format
 * @param locale - Locale string (default: en-US)
 * @returns Formatted price string with BDT symbol
 */
export const formatPrice = (
    amount: number | string | null | undefined,
    locale: string = "en-US"
): string => {
    if (amount === null || amount === undefined || amount === "") {
        return "N/A";
    }

    const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return "Invalid amount";
    }

    try {
        const formattedNumber = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numericAmount);

        return ` ৳ ${formattedNumber}`;
    } catch (error) {
        return `${numericAmount.toFixed(0)}`;
    }
};

// Alternative version with configurable fraction digits
export const formatPriceWithOptions = (
    amount: number | string | null | undefined,
    options: {
        locale?: string;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
        fallbackText?: string;
    } = {}
): string => {
    const {
        locale = "en-US",
        minimumFractionDigits = 0,
        maximumFractionDigits = 0,
        fallbackText = "N/A",
    } = options;

    if (amount === null || amount === undefined || amount === "") {
        return fallbackText;
    }

    const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return "Invalid amount";
    }

    try {
        const formattedNumber = new Intl.NumberFormat(locale, {
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(numericAmount);

        return `৳ ${formattedNumber}`;
    } catch (error) {
        return `৳ ${numericAmount.toFixed(maximumFractionDigits)}`;
    }
};

/**
 * Generate full file path for images/assets
 * @param path - Relative path to the file
 * @param baseUrl - Base URL (default: empty, will use current origin)
 * @returns Full URL to the file
 */
export const filePath = (
    path: string | null | undefined,
    baseUrl: string = ""
): string => {
    if (!path) {
        return "/placeholder.png";
    }

    // If it's already a full URL, return as is
    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("//")
    ) {
        return path;
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    // Use provided baseUrl or default to empty (relative to current origin)
    const base = baseUrl || "";

    return `${base}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1"); // Remove duplicate slashes
};

/**
 * Generate full URL for Laravel storage files
 * @param path - Path from storage directory
 * @returns Full URL to storage file
 */
export const storagePath = (path: string | null | undefined): string => {
    if (!path || path === "" || path === "null") {
        return "./placeholder.png";
    }

    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    return `${baseUrl}/storage/${cleanPath}`;
};

/**
 * Generate placeholder image URL
 * @param width - Image width
 * @param height - Image height
 * @param text - Optional text to display
 * @returns Placeholder image URL
 */
export const placeholderImage = (): string => {
    return "/placeholder.png";
};

/**
 * Handle image loading errors by setting a placeholder
 * @param event - React synthetic event
 * @param placeholder - Custom placeholder URL (optional)
 */
export const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
    placeholder?: string
) => {
    const target = event.target as HTMLImageElement;
    target.src = placeholder || placeholderImage();
    target.alt = "Image not available";
};

/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Validate if a string is a valid URL
 * @param string - String to validate
 * @returns Boolean indicating if it's a valid URL
 */
export const isValidUrl = (string: string): boolean => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

/**
 * Extract file extension from filename or URL
 * @param filename - Filename or URL
 * @returns File extension in lowercase
 */
export const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * Check if file is an image based on extension
 * @param filename - Filename or URL
 * @returns Boolean indicating if it's an image
 */
export const isImageFile = (filename: string): boolean => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const ext = getFileExtension(filename);
    return imageExtensions.includes(ext);
};

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param locale - Locale string (default: en-US)
 * @returns Formatted date string
 */
export const formatDate = (
    date: string | Date,
    locale: string = "en-US"
): string => {
    if (!date) return "N/A";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(dateObj);
};

/**
 * Format date with time
 * @param date - Date string or Date object
 * @param locale - Locale string (default: en-US)
 * @returns Formatted date and time string
 */
export const formatDateTime = (
    date: string | Date,
    locale: string = "en-US"
): string => {
    if (!date) return "N/A";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(dateObj);
};

/**
 * Generate a random unique ID
 * @returns Random unique ID string
 */
export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: ...)
 * @returns Truncated text
 */
export const truncateText = (
    text: string,
    length: number,
    suffix: string = "..."
): string => {
    if (text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
};

/**
 * Capitalize first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalize = (text: string): string => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert string to slug
 * @param text - Text to convert
 * @returns Slugified string
 */
export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

/**
 * Check if a product is considered new based on creation date
 * @param createdAt - Creation date string
 * @param days - Number of days to consider as new (default: 30)
 * @returns Boolean indicating if product is new
 */
export const isNewProduct = (createdAt: string, days: number = 30): boolean => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);
    return createdDate > thresholdDate;
};

/**
 * Calculate profit based on sale price, purchase price and additional costs
 * @param salePrice - Sale price
 * @param purchasePrice - Purchase price
 * @param additionalCost - Additional cost (default: 0)
 * @returns Calculated profit
 */
export const calculateProfit = (
    salePrice: number,
    purchasePrice: number,
    additionalCost: number = 0
): number => {
    return salePrice - (purchasePrice + additionalCost);
};

/**
 * Generate full URL for assets
 * - Returns absolute URLs as is
 * - Returns CDN URL for simple filenames (imported images)
 * - Returns storage URL for relative paths (local uploads)
 * @param path - Image filename or full URL
 * @returns Full URL
 */
export const getAssetUrl = (path: string | null | undefined): string => {
    if (!path) return "/placeholder.png";

    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("//")
    ) {
        return path;
    }

    // If it's just a filename (no slashes), assuming it's from the CDN source
    // if (!path.includes("/")) {
    //     return `https://cdn.jsdelivr.net/gh/legend-sabbir/paikari-world@latest/${path}`;
    // }

    // Otherwise treat as local storage path
    return storagePath(path);
};

/**
 * Ensure a storage path has a prefix when user provides only filename.
 * - Keeps absolute URLs as-is
 * - Trims leading slashes for local paths
 * - If the remaining value has no '/', treat as filename and prefix it
 */
export const ensureStoragePrefix = (
    path: string | null | undefined,
    prefix: string
): string | null => {
    if (!path) return null;
    const raw = String(path).trim();
    if (!raw) return null;

    if (
        raw.startsWith("http://") ||
        raw.startsWith("https://") ||
        raw.startsWith("//")
    ) {
        return raw;
    }

    const clean = raw.startsWith("/") ? raw.slice(1) : raw;
    if (!clean.includes("/")) {
        const p = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
        return `${p}/${clean}`;
    }
    return clean;
};

export const ensureProductImagePath = (path: string | null | undefined): string | null =>
    ensureStoragePrefix(path, "products");

export const ensureVariationImagePath = (path: string | null | undefined): string | null =>
    ensureStoragePrefix(path, "products/variations");

/**
 * Cookie utility functions for reliable cookie management
 */

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift() || null;
    }
    return null;
};

/**
 * Set a cookie with reliable expiration
 * @param name - Cookie name
 * @param value - Cookie value
 * @param maxAgeDays - Maximum age in days (default: 730 days / 2 years)
 * @param options - Additional cookie options
 */
export const setCookie = (
    name: string,
    value: string,
    maxAgeDays: number = 730,
    options: {
        path?: string;
        sameSite?: "Strict" | "Lax" | "None";
        secure?: boolean;
    } = {}
): void => {
    if (typeof document === "undefined") return;

    const {
        path = "/",
        sameSite = "Lax",
        secure = false,
    } = options;

    // Convert days to seconds for max-age
    const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;

    // Detect if site is HTTPS (critical for iOS Safari cookie persistence)
    const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";

    // Build cookie string with max-age (more reliable than expires)
    let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAgeSeconds}; SameSite=${sameSite}`;

    // Add secure flag if HTTPS or explicitly requested (required for SameSite=None and iOS Safari)
    if (secure || sameSite === "None" || isSecure) {
        cookieString += "; Secure";
    }

    document.cookie = cookieString;
};

/**
 * Delete a cookie
 * @param name - Cookie name
 * @param path - Cookie path (default: /)
 */
export const deleteCookie = (name: string, path: string = "/"): void => {
    if (typeof document === "undefined") return;
    
    // Include Secure flag if HTTPS (for proper deletion on iOS Safari)
    const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
    const secureFlag = isSecure ? "; Secure" : "";
    document.cookie = `${name}=; path=${path}; max-age=0; SameSite=Lax${secureFlag}`;
};

/**
 * Migrate guest orders from cookie to localStorage (one-time migration)
 * @returns true if migration was successful, false otherwise
 */
const migrateGuestOrdersFromCookie = (): boolean => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return false;
    }

    try {
        // Check if migration already happened
        if (localStorage.getItem("guest_orders") !== null) {
            return false; // Already migrated
        }

        // Check for existing cookie
        const cookieValue = getCookie("guest_orders");
        if (!cookieValue) {
            return false; // No cookie to migrate
        }

        // Parse cookie data
        const parsed = JSON.parse(decodeURIComponent(cookieValue));
        if (!Array.isArray(parsed)) {
            return false; // Invalid cookie data
        }

        // Write to localStorage
        const limitedOrderIds = parsed.slice(0, 50); // Limit to 50 orders
        localStorage.setItem("guest_orders", JSON.stringify(limitedOrderIds));

        // Clean up cookie after successful migration
        deleteCookie("guest_orders");

        return true;
    } catch (e) {
        console.error("Failed to migrate guest orders from cookie to localStorage", e);
        return false;
    }
};

/**
 * Get and parse guest orders from localStorage
 * Automatically migrates from cookie on first access if needed
 * @returns Array of order IDs or empty array
 */
export const getGuestOrders = (): number[] => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        // Fallback to cookie if localStorage is not available
        const cookieValue = getCookie("guest_orders");
        if (!cookieValue) return [];

        try {
            const parsed = JSON.parse(decodeURIComponent(cookieValue));
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse guest orders cookie", e);
            return [];
        }
    }

    try {
        // Attempt migration from cookie if localStorage is empty
        migrateGuestOrdersFromCookie();

        // Read from localStorage
        const storedValue = localStorage.getItem("guest_orders");
        if (!storedValue) return [];

        const parsed = JSON.parse(storedValue);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        // Handle QuotaExceededError, SecurityError, or JSON parse errors
        if (e instanceof DOMException) {
            if (e.name === "QuotaExceededError") {
                console.warn("localStorage quota exceeded for guest orders");
            } else if (e.name === "SecurityError") {
                console.warn("localStorage access denied, falling back to cookie");
                // Fallback to cookie
                const cookieValue = getCookie("guest_orders");
                if (!cookieValue) return [];
                try {
                    const parsed = JSON.parse(decodeURIComponent(cookieValue));
                    return Array.isArray(parsed) ? parsed : [];
                } catch (parseError) {
                    console.error("Failed to parse guest orders cookie", parseError);
                    return [];
                }
            }
        } else {
            console.error("Failed to get guest orders from localStorage", e);
        }
        return [];
    }
};

/**
 * Set guest orders in localStorage
 * @param orderIds - Array of order IDs
 * @param maxAgeDays - Deprecated parameter (kept for backward compatibility, not used)
 */
export const setGuestOrders = (
    orderIds: number[],
    maxAgeDays: number = 730
): void => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        // Fallback to cookie if localStorage is not available
        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            deleteCookie("guest_orders");
            return;
        }
        const limitedOrderIds = orderIds.slice(0, 50);
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        setCookie("guest_orders", JSON.stringify(limitedOrderIds), maxAgeDays, {
            secure: isSecure
        });
        return;
    }

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
        // If empty, remove from localStorage
        try {
            localStorage.removeItem("guest_orders");
        } catch (e) {
            console.error("Failed to remove guest orders from localStorage", e);
        }
        return;
    }

    try {
        // Limit to 50 orders to prevent storage issues
        const limitedOrderIds = orderIds.slice(0, 50);
        localStorage.setItem("guest_orders", JSON.stringify(limitedOrderIds));
    } catch (e) {
        if (e instanceof DOMException) {
            if (e.name === "QuotaExceededError") {
                console.warn("localStorage quota exceeded, cannot save guest orders");
            } else if (e.name === "SecurityError") {
                console.warn("localStorage access denied, falling back to cookie");
                // Fallback to cookie
                const limitedOrderIds = orderIds.slice(0, 50);
                const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
                setCookie("guest_orders", JSON.stringify(limitedOrderIds), maxAgeDays, {
                    secure: isSecure
                });
            }
        } else {
            console.error("Failed to set guest orders in localStorage", e);
        }
    }
};

/**
 * Add an order ID to guest orders in localStorage
 * @param orderId - Order ID to add
 * @param maxAgeDays - Deprecated parameter (kept for backward compatibility, not used)
 */
export const addGuestOrder = (
    orderId: number,
    maxAgeDays: number = 730
): void => {
    const existingOrders = getGuestOrders();
    
    // Don't add if already exists
    if (existingOrders.includes(orderId)) {
        // No need to update if already exists (localStorage persists indefinitely)
        return;
    }

    // Add to beginning of array
    const updatedOrders = [orderId, ...existingOrders];
    setGuestOrders(updatedOrders, maxAgeDays);
};

/**
 * Remove an order ID from guest orders in localStorage
 * @param orderId - Order ID to remove
 * @param maxAgeDays - Deprecated parameter (kept for backward compatibility, not used)
 */
export const removeGuestOrder = (
    orderId: number,
    maxAgeDays: number = 730
): void => {
    const existingOrders = getGuestOrders();
    const updatedOrders = existingOrders.filter((id) => id !== orderId);
    setGuestOrders(updatedOrders, maxAgeDays);
};

// Export all helpers
export default {
    formatCurrency,
    formatPrice,
    filePath,
    storagePath,
    placeholderImage,
    handleImageError,
    formatFileSize,
    isValidUrl,
    getFileExtension,
    isImageFile,
    debounce,
    formatDate,
    formatDateTime,
    generateId,
    truncateText,
    capitalize,
    slugify,
    isNewProduct,
    calculateProfit,
    getAssetUrl,
    ensureStoragePrefix,
    ensureProductImagePath,
    ensureVariationImagePath,
    getCookie,
    setCookie,
    deleteCookie,
    getGuestOrders,
    setGuestOrders,
    addGuestOrder,
    removeGuestOrder,
};
