import React, { useState, useEffect, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Product } from "@/types";
import { ShoppingCart, Heart, Share2, ChevronRight, Check } from "lucide-react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";
import { useCartStore } from "@/Stores/useCartStore";
import { useDebounce } from "@/Hooks/useDebounce";
import QuantitySelector from "@/Components/Ui/QuantitySelector";
import ProductVariationSelector from "@/Components/Customer/ProductVariationSelector";

interface ProductShowProps {
    product: Product;
    related_products: Product[];
}

export default function ProductShow({
    product,
    related_products,
}: ProductShowProps) {
    const { cart, addToCart, updateQuantity, setIsOpen } = useCartStore();
    const cartItem = cart[String(product.id)];
    const isInCart = !!cartItem;
    const hasVariations =
        product.product_variations && product.product_variations.length > 0;

    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
    const [selectedImage, setSelectedImage] = useState(
        product.images?.[0] || null,
    );
    const [selectedVariationPrice, setSelectedVariationPrice] = useState<
        number | null
    >(null);
    const debouncedQuantity = useDebounce(quantity, 300);

    // Sync local quantity with store quantity (handling external updates)
    useEffect(() => {
        if (cartItem) {
            setQuantity(cartItem.quantity);
        }
    }, [cartItem?.quantity]);

    // Debounced update to store (handling local updates)
    useEffect(() => {
        if (
            debouncedQuantity > 0 &&
            cartItem &&
            debouncedQuantity !== cartItem.quantity
        ) {
            updateQuantity(String(product.id), debouncedQuantity);
        }
    }, [debouncedQuantity, updateQuantity, product.id]);

    const handleQuantityChange = (type: "increment" | "decrement") => {
        if (type === "increment") {
            setQuantity((prev) => prev + 1);
        } else if (type === "decrement" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (isInCart) {
            setIsOpen(true);
        } else {
            addToCart(product, quantity);
        }
    };

    const handleVariationAddToCart = (variations: any[], quantity: number) => {
        addToCart(product, quantity, variations);
    };

    return (
        <CustomerLayout>
            <Head title={product.name} />

            <div className="bg-gray-50 py-4 md:py-8">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="hidden md:flex items-center text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-gray-900">
                            Home
                        </Link>
                        <ChevronRight size={16} className="mx-2" />
                        <Link
                            href={route("products.index")}
                            className="hover:text-gray-900"
                        >
                            Products
                        </Link>
                        {product.category && (
                            <>
                                <ChevronRight size={16} className="mx-2" />
                                <Link
                                    href={route(
                                        "products.category",
                                        product.category.slug,
                                    )}
                                    className="hover:text-gray-900"
                                >
                                    {product.category.title}
                                </Link>
                            </>
                        )}
                        <ChevronRight size={16} className="mx-2" />
                        <span className="text-gray-900 font-medium truncate max-w-xs">
                            {product.name}
                        </span>
                    </nav>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-4 md:p-6 lg:p-8">
                            {/* Image Gallery */}
                            <div className="space-y-4">
                                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                                    <Image
                                        src={getAssetUrl(
                                            selectedImage || product.images[0],
                                        )}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.stock <= 0 &&
                                        !product.is_preorder && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold text-lg">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                </div>
                                {product.images &&
                                    product.images.length > 1 && (
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                            {product.images.map(
                                                (image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                image,
                                                            )
                                                        }
                                                        className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                                                            (selectedImage ||
                                                                product
                                                                    .images[0]) ===
                                                            image
                                                                ? "border-indigo-600 ring-2 ring-indigo-100"
                                                                : "border-transparent hover:border-gray-200"
                                                        }`}
                                                    >
                                                        <img
                                                            src={getAssetUrl(
                                                                image,
                                                            )}
                                                            alt={`${product.name} ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                <div className="flex flex-wrap items-baseline gap-3 mb-6">
                                    {useMemo(() => {
                                        if (
                                            selectedVariationPrice !== null &&
                                            selectedVariationPrice > 0
                                        ) {
                                            return (
                                                <span className="text-2xl md:text-3xl font-bold text-indigo-600">
                                                    ৳{selectedVariationPrice}
                                                </span>
                                            );
                                        }

                                        // Check if base price is effectively 0 and we have variations with prices
                                        if (
                                            (!product.sale_price ||
                                                Number(product.sale_price) ===
                                                    0) &&
                                            hasVariations &&
                                            product.product_variations
                                        ) {
                                            const validPrices =
                                                product.product_variations
                                                    .map((v) =>
                                                        v.price != null
                                                            ? parseFloat(
                                                                  String(
                                                                      v.price,
                                                                  ),
                                                              )
                                                            : 0,
                                                    )
                                                    .filter((p) => p > 0);

                                            if (validPrices.length > 0) {
                                                const minPrice = Math.min(
                                                    ...validPrices,
                                                );
                                                const maxPrice = Math.max(
                                                    ...validPrices,
                                                );

                                                if (minPrice === maxPrice) {
                                                    return (
                                                        <span className="text-2xl md:text-3xl font-bold text-indigo-600">
                                                            ৳{minPrice}
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <span className="text-2xl md:text-3xl font-bold text-indigo-600">
                                                        ৳{minPrice} - ৳
                                                        {maxPrice}
                                                    </span>
                                                );
                                            }
                                        }

                                        // Standard logic
                                        if (
                                            product.discounted_sale_price !=
                                                null &&
                                            Number(
                                                product.discounted_sale_price,
                                            ) < Number(product.sale_price)
                                        ) {
                                            return (
                                                <>
                                                    <span className="text-xl text-gray-500 line-through">
                                                        ৳{product.sale_price}
                                                    </span>
                                                    <span className="text-2xl md:text-3xl font-bold text-indigo-600">
                                                        ৳
                                                        {
                                                            product.discounted_sale_price
                                                        }
                                                    </span>
                                                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                        Sale
                                                    </span>
                                                </>
                                            );
                                        }

                                        return (
                                            <span className="text-2xl md:text-3xl font-bold text-indigo-600">
                                                ৳{product.sale_price || 0}
                                            </span>
                                        );
                                    }, [
                                        product,
                                        selectedVariationPrice,
                                        hasVariations,
                                    ])}
                                </div>

                                {/* Variation Selection OR Simple Add to Cart */}
                                {hasVariations ? (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                                            Select Options
                                        </h3>
                                        <ProductVariationSelector
                                            product={product}
                                            onAddToCart={
                                                handleVariationAddToCart
                                            }
                                            onVariationSelect={(
                                                variation,
                                                allSelected,
                                            ) => {
                                                const imageVariation =
                                                    Object.values(
                                                        allSelected,
                                                    ).find((v) => v.image);
                                                setSelectedImage(
                                                    imageVariation?.image ||
                                                        product.images?.[0] ||
                                                        null,
                                                );

                                                // Find if they selected a price-overriding variation
                                                const priceVariation =
                                                    Object.values(
                                                        allSelected,
                                                    ).find(
                                                        (v) =>
                                                            v.price !== null &&
                                                            v.price !==
                                                                undefined &&
                                                            parseFloat(
                                                                String(v.price),
                                                            ) > 0,
                                                    );

                                                if (
                                                    priceVariation &&
                                                    priceVariation.price
                                                ) {
                                                    setSelectedVariationPrice(
                                                        parseFloat(
                                                            String(
                                                                priceVariation.price,
                                                            ),
                                                        ),
                                                    );
                                                } else {
                                                    setSelectedVariationPrice(
                                                        null,
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-auto space-y-6">
                                        <div className="flex flex-col items-center sm:flex-row gap-4 sm:items-center sm:justify-center">
                                            <QuantitySelector
                                                quantity={quantity}
                                                onDecrease={() =>
                                                    handleQuantityChange(
                                                        "decrement",
                                                    )
                                                }
                                                onIncrease={() =>
                                                    handleQuantityChange(
                                                        "increment",
                                                    )
                                                }
                                                max={
                                                    product.is_preorder
                                                        ? undefined
                                                        : product.stock
                                                }
                                                size="lg"
                                            />
                                            <button
                                                className={`w-full sm:flex-1 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md ${
                                                    isInCart
                                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200"
                                                        : "bg-gray-900 hover:bg-gray-800 text-white shadow-gray-200"
                                                }`}
                                                disabled={
                                                    !product.is_preorder &&
                                                    product.stock <= 0
                                                }
                                                onClick={handleAddToCart}
                                            >
                                                {isInCart ? (
                                                    <>
                                                        <Check
                                                            size={20}
                                                            strokeWidth={3}
                                                        />
                                                        Added to Cart
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart
                                                            size={20}
                                                        />
                                                        {product.is_preorder &&
                                                        product.stock <= 0
                                                            ? "Pre Order"
                                                            : "Add to Cart"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div
                                    className="prose prose-sm text-gray-600 mb-8 max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: (product.description || "")
                                            .replace(/\\n/g, "<br/>")
                                            .replace(/\n/g, "<br/>"),
                                    }}
                                />

                                {/* Meta Info */}
                                <div className="border-t border-gray-100 pt-6 mt-8 space-y-3 text-sm text-gray-500">
                                    {product.sku && (
                                        <div className="flex justify-between">
                                            <span>SKU:</span>
                                            <span className="font-medium text-gray-900">
                                                {product.sku}
                                            </span>
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="flex justify-between">
                                            <span>Category: </span>
                                            <Link
                                                href={route(
                                                    "products.category",
                                                    product.category.slug,
                                                )}
                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                {product.category.title}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
