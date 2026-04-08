import React, { useState, useEffect, useMemo, useRef } from "react";
import { Product, ProductVariation } from "@/types";
import { Check, X } from "lucide-react";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";
import { toast } from "sonner";

interface ProductVariationSelectorProps {
    product: Product;
    onAddToCart: (variations: ProductVariation[], quantity: number) => void;
    onVariationSelect?: (
        variation: ProductVariation,
        allSelected: Record<number, ProductVariation>,
    ) => void;
}

const ProductVariationSelector: React.FC<ProductVariationSelectorProps> = ({
    product,
    onAddToCart,
    onVariationSelect,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [selectedVariations, setSelectedVariations] = useState<
        Record<number, ProductVariation>
    >({});
    const [cartBatch, setCartBatch] = useState<
        { variations: ProductVariation[]; quantity: number }[]
    >([]);

    // Group variations by attribute
    const variationsByAttribute = useMemo(() => {
        const groups: Record<
            number,
            { name: string; variations: ProductVariation[] }
        > = {};

        if (!product.product_variations) return groups;

        product.product_variations.forEach((variation) => {
            const attrId = variation.product_attribute_id;
            const attrName =
                variation.product_attribute?.name ||
                variation.attribute?.name ||
                "Option";

            if (attrId) {
                if (!groups[attrId]) {
                    groups[attrId] = {
                        name: attrName,
                        variations: [],
                    };
                }
                groups[attrId].variations.push(variation);
            }
        });

        return groups;
    }, [product]);

    const handleVariationSelect = (
        attributeId: number,
        variation: ProductVariation,
    ) => {
        const newSelected = {
            ...selectedVariations,
            [attributeId]: variation,
        };
        setSelectedVariations(newSelected);
        if (onVariationSelect) {
            onVariationSelect(variation, newSelected);
        }
    };

    const isAllSelected =
        Object.keys(variationsByAttribute).length > 0 &&
        Object.keys(variationsByAttribute).every(
            (attrId) => selectedVariations[Number(attrId)],
        );

    // Calculate available stock for CURRENT selection
    const currentSelectionStock = useMemo(() => {
        if (!isAllSelected || Object.keys(selectedVariations).length === 0) {
            return product.stock;
        }
        const selectedVariationList = Object.values(selectedVariations);
        const variationStocks = selectedVariationList
            .map((v) => v.stock ?? product.stock)
            .filter((s) => s !== undefined && s !== null && !isNaN(s));

        if (variationStocks.length === 0) return product.stock;
        return Math.min(...variationStocks);
    }, [selectedVariations, isAllSelected, product.stock]);

    // Detect completion and auto-add to batch
    useEffect(() => {
        if (isAllSelected) {
            const currentVariations = Object.values(selectedVariations);

            // Generate a signature for comparison
            const currentIds = currentVariations
                .map((v) => v.id)
                .sort()
                .join("-");

            // Check if already in batch
            const existsIndex = cartBatch.findIndex(
                (item) =>
                    item.variations
                        .map((v) => v.id)
                        .sort()
                        .join("-") === currentIds,
            );

            if (existsIndex === -1) {
                if (product.is_preorder || currentSelectionStock > 0) {
                    // Add new item
                    const initialQty = 1;
                    setCartBatch((prev) => [
                        ...prev,
                        { variations: currentVariations, quantity: initialQty },
                    ]);
                } else {
                    // Provide clear feedback that it's out of stock
                    toast.error("This combination is currently out of stock!");
                    
                    // Clear the last selected option so they aren't stuck on a 0 stock completion
                    // We pop off the last one or just reset it. Since we don't know the order easily,
                    // we can just reset the selection.
                    setSelectedVariations({});
                }
            }
        }
    }, [
        selectedVariations,
        isAllSelected,
        product.is_preorder,
        currentSelectionStock,
        // cartBatch // Logic implies we need to check existence, but we don't want to loop.
        // The previous implementation had cartBatch in deps, but handled loop by existsIndex check.
        // We will include it to be safe and rely on the check.
        cartBatch,
    ]);

    const handleBatchQuantityUpdate = (index: number, newQty: number) => {
        const minQty = 1;

        if (newQty < minQty) return;

        // Calculate max stock for this specific item in batch
        const item = cartBatch[index];
        const itemStock = Math.min(
            ...item.variations.map((v) => v.stock ?? product.stock),
        );
        const maxQty = product.is_preorder ? undefined : itemStock;

        if (maxQty !== undefined && newQty > maxQty) {
            toast.error(`Only ${maxQty} available for this item`);
            return;
        }

        setCartBatch((prev) => {
            const newBatch = [...prev];
            newBatch[index].quantity = newQty;
            return newBatch;
        });
    };

    const handleRemoveFromBatch = (index: number) => {
        const itemToRemove = cartBatch[index];
        const isCurrentSelection =
            isAllSelected &&
            itemToRemove.variations.every((v) => {
                const attrId = v.product_attribute_id;
                return attrId ? selectedVariations[attrId]?.id === v.id : false;
            });

        if (isCurrentSelection) {
            setSelectedVariations({});
        }

        setCartBatch((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddToCart = () => {
        if (cartBatch.length === 0) return;

        cartBatch.forEach((item) => {
            onAddToCart(item.variations, item.quantity);
        });
        toast.success(`Added ${cartBatch.length} items to cart`);
        setCartBatch([]);
        setSelectedVariations({});
    };

    const batchTotalQuantity = cartBatch.reduce(
        (acc, item) => acc + item.quantity,
        0,
    );
    const batchTotalPrice = cartBatch.reduce((acc, item) => {
        // Calculate price for this item
        const prices = item.variations
            .map((v) => (v.price ? parseFloat(String(v.price)) : null))
            .filter((p) => p !== null) as number[];
        const price =
            prices.length > 0 ? Math.max(...prices) : product.sale_price;
        return acc + price * item.quantity;
    }, 0);

    // If no variations, return null (should be handled by parent but safe keep)
    if (!product.product_variations || product.product_variations.length === 0)
        return null;

    const handleWheelCapture: React.WheelEventHandler<HTMLDivElement> = (e) => {
        const el = scrollContainerRef.current;
        if (!el) return;

        // Keep wheel scroll inside this selector and prevent page scroll chaining.
        if (el.scrollHeight > el.clientHeight) {
            e.preventDefault();
            e.stopPropagation();
            el.scrollTop += e.deltaY;
        }
    };

    return (
        <div className="space-y-6">
            <div
                ref={scrollContainerRef}
                onWheelCapture={handleWheelCapture}
                className="max-h-[70vh] md:max-h-[34rem] overflow-y-auto overscroll-contain pr-1 space-y-6 touch-pan-y"
            >
                {/* Attributes Selection */}
                <div className="space-y-5">
                    {Object.entries(variationsByAttribute).map(
                        ([attrId, group]) => (
                            <div key={attrId}>
                                <h5 className="text-sm font-semibold text-gray-800 mb-3 block">
                                    {group.name}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {group.variations.map((variation) => {
                                        const isSelected =
                                            selectedVariations[Number(attrId)]
                                                ?.id === variation.id;
                                        const showPriceHint =
                                            variation.price &&
                                            parseFloat(
                                                String(variation.price),
                                            ) !== product.sale_price;

                                        const isOutOfStock =
                                            !product.is_preorder &&
                                            variation.stock !== null &&
                                            variation.stock !== undefined &&
                                            variation.stock <= 0;

                                        return (
                                            <button
                                                key={variation.id}
                                                onClick={() => {
                                                    if (isOutOfStock) {
                                                        toast.error(
                                                            "This specific option is out of stock.",
                                                        );
                                                        return;
                                                    }
                                                    handleVariationSelect(
                                                        Number(attrId),
                                                        variation,
                                                    );
                                                }}
                                                disabled={isOutOfStock}
                                                className={`relative py-2.5 pr-4 text-sm border transition-all flex items-center gap-2 font-medium ${
                                                    variation.image
                                                        ? "pl-2"
                                                        : "pl-4"
                                                } ${
                                                    isOutOfStock
                                                        ? "border-slate-200 bg-slate-50 opacity-80 cursor-not-allowed"
                                                        : isSelected
                                                          ? "border-brand-primary bg-brand-bg text-brand-primary shadow-sm ring-1 ring-brand-primary"
                                                          : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                                                } rounded-lg group`}
                                            >
                                                {variation.image && (
                                                    <img
                                                        src={getAssetUrl(
                                                            variation.image,
                                                        )}
                                                        alt={variation.value}
                                                        className={`w-6 h-6 rounded object-cover bg-white pointer-events-none shrink-0 relative z-10 ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                                                    />
                                                )}
                                                <span
                                                    className={`relative z-10 flex items-center gap-1.5 ${isOutOfStock ? "text-slate-400" : ""}`}
                                                >
                                                    {variation.value}
                                                    {isOutOfStock && (
                                                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-sm border border-rose-100/50">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </span>
                                                {showPriceHint && (
                                                    <span
                                                        className={`text-xs font-normal ml-0.5 relative z-10 ${isOutOfStock ? "" : "opacity-70"}`}
                                                    >
                                                        (
                                                        {formatPrice(
                                                            variation.price!,
                                                        )}
                                                        )
                                                    </span>
                                                )}
                                                {isSelected &&
                                                    !isOutOfStock && (
                                                        <Check
                                                            size={14}
                                                            strokeWidth={3}
                                                            className="relative z-10"
                                                        />
                                                    )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ),
                    )}
                </div>

                {/* Helper Text */}
                <div className="text-xs text-gray-500 italic">
                    Select options to automatically add them to your list below.
                </div>

                {/* Batch List Display */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h5 className="font-semibold text-gray-900 text-sm">
                            Your Selection
                        </h5>
                        {cartBatch.length > 0 && (
                            <span className="text-brand-primary text-xs font-bold bg-brand-bg px-2 py-1 rounded-full">
                                {cartBatch.length} items
                            </span>
                        )}
                    </div>

                    <div className="p-4 bg-white">
                        {cartBatch.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                                No items selected yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cartBatch.map((item, index) => {
                                    const prices = item.variations
                                        .map((v) =>
                                            v.price
                                                ? parseFloat(String(v.price))
                                                : null,
                                        )
                                        .filter((p) => p !== null) as number[];
                                    const itemPrice =
                                        prices.length > 0
                                            ? Math.max(...prices)
                                            : product.sale_price;

                                    const isCurrent =
                                        isAllSelected &&
                                        Object.values(selectedVariations).every(
                                            (v) =>
                                                item.variations.some(
                                                    (iv) => iv.id === v.id,
                                                ),
                                        );

                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                                isCurrent
                                                    ? "bg-brand-bg border-brand-bg ring-1 ring-brand-bg"
                                                    : "bg-white border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-gray-900 text-sm truncate">
                                                    {item.variations
                                                        .map((v) => {
                                                            const attrName =
                                                                v
                                                                    .product_attribute
                                                                    ?.name ||
                                                                v.attribute
                                                                    ?.name ||
                                                                "Option";
                                                            return `${attrName}: ${v.value}`;
                                                        })
                                                        .join(", ")}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5 font-medium">
                                                    {formatPrice(itemPrice)} ×{" "}
                                                    {item.quantity} ={" "}
                                                    {formatPrice(
                                                        itemPrice *
                                                            item.quantity,
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8">
                                                <button
                                                    onClick={() =>
                                                        handleBatchQuantityUpdate(
                                                            index,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    className={`w-8 h-full flex items-center justify-center rounded-l-lg transition-colors ${
                                                        item.quantity <= 1
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : "hover:bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-900 leading-none">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleBatchQuantityUpdate(
                                                            index,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded-r-lg transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleRemoveFromBatch(index)
                                                }
                                                className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {cartBatch.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600 text-sm">
                                        Total Amount({batchTotalQuantity} items)
                                    </span>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {formatPrice(batchTotalPrice)}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-primary/90 hover:shadow-xl transition-all transform active:scale-[0.98]"
                                    onClick={handleAddToCart}
                                >
                                    Add All to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {cartBatch.length > 0 && (
                <div className="md:hidden text-[11px] text-gray-500">
                    Tip: swipe inside the selector area to browse options.
                </div>
            )}
        </div>
    );
};

export default ProductVariationSelector;
