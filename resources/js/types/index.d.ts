// types/index.ts

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

// Category type
export interface Category {
    id: number;
    title: string;
    slug: string;
    image: string;
    description?: string;
    is_featured?: boolean;
    created_at?: string;
    updated_at?: string;
}

// Brand type
export interface Brand {
    id: number;
    title: string;
    slug: string;
    image?: string | null;
    is_featured?: boolean;
    created_at?: string;
    updated_at?: string;
}

// Supplier type
export interface Supplier {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    contact_info?: string | null;
    created_at?: string;
    updated_at?: string;
}

// ... (skipping unchange lines)

// Cart Item type
export interface CartItem {
    cart_id: string;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    image: string | null;
    is_preorder?: boolean;
    variations?: ProductVariation[];
    category_id?: number;
    min_order_qty?: number;
    add_cart_qty?: number;
    use_add_cart_qty_as_min?: boolean;
}

export interface DeliveryCharge {
    id: number;
    name: string;
    cost: number;
    duration: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product?: Product;
    quantity: number;
    price: number;
    variation_ids?: number[];
}

export interface Order {
    id: number;
    customer_name: string | null;
    customer_phone: string;
    customer_address: string;
    delivery_charge_id: number;
    delivery_cost: number;
    subtotal: number;
    total: number;
    status: string;
    success_rate?: number;
    created_at: string;
    items?: OrderItem[];
    delivery_charge?: DeliveryCharge;
    courier_order_history?: {
        total_orders: number;
        cancel_orders: number;
        success_ratio: number;
        successful_orders: number;
    };
}

// Main Product interface
export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    images: string[];
    purchase_price: number;
    sale_price: number;
    moq_price?: number;
    uan_price?: number;
    stock: number;
    category_id?: number;
    brand_id?: number | null;
    supplier_id?: number;
    category?: Category;
    brand?: Brand | null;
    supplier?: Supplier;
    product_variations?: ProductVariation[];
    qty_price?: QtyPrice[];
    status?: "active" | "inactive" | "draft" | "out_of_stock";
    sku?: string;
    barcode?: string;
    weight?: number;
    dimensions?: string;
    featured?: boolean;
    is_preorder?: boolean;
    created_at: string;
    updated_at: string;
}

// Laravel Pagination Link
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Laravel Paginated Data
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

// Props for different pages
export interface ProductsIndexProps {
    products: PaginatedData<Product>;
    categories: Category[];
    brands: Brand[];
    suppliers: Supplier[];
    stats: {
        total: number;
        checkouts: number;
        stock: number;
        buy_value: number;
        sell_value: number;
        profit: number;
    };
    filters: {
        search?: string;
        category?: string;
        brand?: string;
        supplier?: string;
        sort?: string;
    };
}

export interface CreatePageProps extends PageProps {
    categories: Category[];
    brands: Brand[];
    suppliers: Supplier[];
    attributes: ProductAttribute[];
}

export interface EditPageProps extends PageProps {
    product: Product;
    categories: Category[];
    brands: Brand[];
    suppliers: Supplier[];
    attributes: ProductAttribute[];
}

export interface ShowPageProps extends PageProps {
    product: Product;
}

// Form data types for create/edit operations
export interface ProductFormData {
    name: string;
    slug: string;
    description: string;
    category_id: string;
    supplier_id: string;
    purchase_price: string;
    sale_price: string;
    moq_price: string;
    uan_price: string;
    stock: string;
    status: string;
    sku?: string;
    barcode?: string;
    weight?: string;
    dimensions?: string;
    featured?: boolean;
    images: File[];
    variations: VariationFormData[];
    qty_prices: QtyPriceFormData[];
}

export interface VariationFormData {
    id?: string; // For existing variations
    attribute_id: string;
    value: string;
    stock?: string;
    price?: string;
}

export interface QtyPriceFormData {
    id?: string; // For existing qty prices
    qty: string;
    price: string;
}

// API Response types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
    status: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
    data: T;
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
    };
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
}

// Filter and Search types
export interface ProductFilters {
    category?: number | string;
    supplier?: number | string;
    stock_status?: "in_stock" | "out_of_stock" | "low_stock";
    status?: "active" | "inactive" | "draft";
    search?: string;
    min_price?: number;
    max_price?: number;
    featured?: boolean;
}

export interface PaginationParams {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

// Dashboard and Analytics types
export interface DashboardStats {
    total_products: number;
    total_categories: number;
    total_suppliers: number;
    low_stock_products: number;
    out_of_stock_products: number;
    total_revenue?: number;
    monthly_sales?: number;
}

export interface StockAlert {
    product_id: number;
    product_name: string;
    current_stock: number;
    threshold: number;
    status: "low" | "out";
}

// Image type for better handling
export interface ProductImage {
    id?: number;
    url: string;
    alt?: string;
    is_primary?: boolean;
    order?: number;
}

// Export types for form handling
export type FormField<T = any> = {
    value: T;
    error?: string;
    required?: boolean;
};

export interface ProductFormState {
    name: FormField<string>;
    description: FormField<string>;
    category_id: FormField<string>;
    supplier_id: FormField<string>;
    purchase_price: FormField<string>;
    sale_price: FormField<string>;
    stock: FormField<string>;
    [key: string]: FormField;
}

// Validation Error type
export interface ValidationErrors {
    [key: string]: string[];
}

// Inertia.js specific types
export interface InertiaPageProps<T = any> extends PageProps {
    errors: ValidationErrors;
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    props: T;
}

// Route parameters type
export interface RouteParams {
    id?: string | number;
    product?: string | number;
    category?: string | number;
    [key: string]: string | number | undefined;
}

// Select Option type for dropdowns
export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

// Bulk Action types
export interface BulkAction {
    type:
    | "delete"
    | "activate"
    | "deactivate"
    | "update_category"
    | "update_supplier";
    ids: number[];
    data?: any;
}

// Export all types
export type {
    User,
    PageProps,
    Category,
    Brand,
    Supplier,
    ProductAttribute,
    ProductVariation,
    QtyPrice,
    CartItem,
    DeliveryCharge,
    Order,
    Product,
    ProductsIndexProps,
    CreatePageProps,
    EditPageProps,
    ShowPageProps,
    ProductFormData,
    VariationFormData,
    QtyPriceFormData,
    ApiResponse,
    PaginatedResponse,
    ProductFilters,
    PaginationParams,
    DashboardStats,
    StockAlert,
    ProductImage,
    FormField,
    ProductFormState,
    ValidationErrors,
    InertiaPageProps,
    RouteParams,
    SelectOption,
    BulkAction,
};

// Default exports for common types
export default {
    User,
    PageProps,
    Category,
    Supplier,
    Product,
    ProductAttribute,
    ProductVariation,
    QtyPrice,
};
