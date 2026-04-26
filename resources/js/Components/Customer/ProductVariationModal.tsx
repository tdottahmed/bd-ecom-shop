import React, { Fragment, useState, useEffect, useMemo, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Product, ProductVariation } from "@/types";
import { X, Check, Bell, Zap, ShoppingCart } from "lucide-react";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";
import { toast } from "sonner";

interface ProductVariationModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    onAddToCart: (variations: ProductVariation[], quantity: number) => void;
    onBuyNow?: () => void;
    onRequestVariation?: (label: string) => void;
}

const ProductVariationModal: React.FC<ProductVariationModalProps> = ({
    isOpen,
    onClose,
    product,
    onAddToCart,
    onBuyNow,
    onRequestVariation,
}) => {
    const scrollContentRef = useRef<HTMLDivElement | null>(null);
    const [selectedVariations, setSelectedVariations] = useState<
        Record<number, ProductVariation>
    >({});
    const [cartBatch, setCartBatch] = useState<
        { variations: ProductVariation[]; quantity: number }[]
    >([]);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [isOutOfStockCombo, setIsOutOfStockCombo] = useState(false);

    // Group variations by attribute
    const variationsByAttribute = React.useMemo(() => {
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

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedVariations({});
            setCartBatch([]);
            setModalImage(product.images?.[0] || null);
            setIsOutOfStockCombo(false);
        }
    }, [isOpen, product.images]);

    // Lock background page scroll while modal is open.
    useEffect(() => {
        if (!isOpen) return;

        const html = document.documentElement;
        const body = document.body;
        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
        };
    }, [isOpen]);

    const handleVariationSelect = (
        attributeId: number,
        variation: ProductVariation,
    ) => {
        const newSelected = {
            ...selectedVariations,
            [attributeId]: variation,
        };
        setSelectedVariations(newSelected);
        setIsOutOfStockCombo(false);

        const imageVariation = Object.values(newSelected).find((v) => v.image);
        setModalImage(imageVariation?.image || product.images?.[0] || null);
    };

    const buildVariationLabel = (variations: Record<number, ProductVariation>) =>
        Object.values(variations)
            .map((v) => {
                const attrName = v.product_attribute?.name || v.attribute?.name || "Option";
                return `${attrName}: ${v.value}`;
            })
            .join(", ");

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

    // Calculate current price based on selection (for pill hint)
    const currentPriceForPill = useMemo(() => {
        if (!isAllSelected || Object.keys(selectedVariations).length === 0) {
            return product.sale_price;
        }

        const prices = Object.values(selectedVariations)
            .map((v) => (v.price ? parseFloat(String(v.price)) : null))
            .filter((p) => p !== null) as number[];

        if (prices.length > 0) {
            return Math.max(...prices);
        }

        return product.sale_price;
    }, [selectedVariations, isAllSelected, product.sale_price]);

    // Detect completion and auto-add to batch
    useEffect(() => {
        if (isAllSelected) {
            const currentVariations = Object.values(selectedVariations);
            const currentIds = currentVariations.map((v) => v.id).sort().join("-");
            const existsIndex = cartBatch.findIndex(
                (item) =>
                    item.variations.map((v) => v.id).sort().join("-") === currentIds,
            );

            if (existsIndex === -1) {
                if (product.is_preorder || currentSelectionStock > 0) {
                    setIsOutOfStockCombo(false);
                    setCartBatch((prev) => [
                        ...prev,
                        { variations: currentVariations, quantity: 1 },
                    ]);
                } else {
                    // Keep selection — show request prompt instead of resetting
                    setIsOutOfStockCombo(true);
                }
            }
        } else {
            setIsOutOfStockCombo(false);
        }
    }, [
        selectedVariations,
        isAllSelected,
        product.is_preorder,
        currentSelectionStock,
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
        // Check if the removed item is the currently selected one
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
        onClose();
    };

    const handleBuyNow = () => {
        if (cartBatch.length === 0) return;

        cartBatch.forEach((item) => {
            onAddToCart(item.variations, item.quantity);
        });
        onClose();
        onBuyNow?.();
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

    const handleWheelCapture: React.WheelEventHandler<HTMLDivElement> = (e) => {
        const el = scrollContentRef.current;
        if (!el) return;

        if (el.scrollHeight > el.clientHeight) {
            e.preventDefault();
            e.stopPropagation();
            el.scrollTop += e.deltaY;
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="flex h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all flex flex-col max-h-[90vh]">
                                {/* Sticky Header */}
                                <div className="flex justify-between items-center px-6 pt-6 pb-4 flex-shrink-0 border-b border-gray-100">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl font-bold text-gray-900"
                                    >
                                        Select Options
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-2 -mr-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div
                                    ref={scrollContentRef}
                                    onWheelCapture={handleWheelCapture}
                                    className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 text-sm custom-scrollbar touch-pan-y"
                                >
                                    <div className="flex gap-4 mb-6">
                                        {/* Product Thumbnail */}
                                        <div className="relative w-20 h-20 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50">
                                            {modalImage ? (
                                                <img
                                                    src={getAssetUrl(
                                                        modalImage,
                                                    )}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover bg-white"
                                                />
                                            ) : product.images?.[0] ? (
                                                <img
                                                    src={getAssetUrl(
                                                        product.images[0],
                                                    )}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover bg-white"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                                    No Image
                                                </div>
                                            )}

                                            {/* Out of Stock Overlay matching ProductShow */}
                                            {(!product.is_preorder && ((isAllSelected && currentSelectionStock <= 0) || (!isAllSelected && product.stock <= 0))) && (
                                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                    <span className="bg-brand-primary/12 text-brand-primary px-1.5 py-1 rounded text-[9px] sm:text-[10px] font-bold shadow-sm border border-brand-primary/25 text-center leading-tight uppercase tracking-wider">
                                                        Out of<br/>Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 line-clamp-2 text-base">
                                                {product.name}
                                            </h4>
                                            {/* Show base price or range here since dynamic price is per-item now */}
                                            <div className="text-brand-primary font-bold mt-1 text-lg">
                                                {useMemo(() => {
                                                    const priceVariation = Object.values(selectedVariations)
                                                        .find(v => v.price !== null && v.price !== undefined && parseFloat(String(v.price)) > 0);
                                                    const selectedPrice = priceVariation && priceVariation.price ? parseFloat(String(priceVariation.price)) : null;
                                                    
                                                    const hasVariations = product.product_variations && product.product_variations.length > 0;
                                                    
                                                    if (selectedPrice !== null && selectedPrice > 0) {
                                                        return formatPrice(selectedPrice);
                                                    }

                                                    if ((!product.sale_price || Number(product.sale_price) === 0) && hasVariations && product.product_variations) {
                                                        const validPrices = product.product_variations
                                                            .map(v => v.price != null ? parseFloat(String(v.price)) : 0)
                                                            .filter(p => p > 0);
                                                            
                                                        if (validPrices.length > 0) {
                                                            const minPrice = Math.min(...validPrices);
                                                            const maxPrice = Math.max(...validPrices);
                                                            
                                                            if (minPrice === maxPrice) return formatPrice(minPrice);
                                                            return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
                                                        }
                                                    }

                                                    if (product.discounted_sale_price != null && Number(product.discounted_sale_price) < Number(product.sale_price)) {
                                                        return (
                                                            <div className="flex flex-wrap items-baseline gap-2">
                                                                <span className="text-sm text-gray-400 line-through font-normal">
                                                                    {formatPrice(product.sale_price)}
                                                                </span>
                                                                <span>
                                                                    {formatPrice(product.discounted_sale_price)}
                                                                </span>
                                                            </div>
                                                        );
                                                    }

                                                    return formatPrice(product.sale_price || 0);
                                                }, [product, selectedVariations])}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attributes */}
                                    <div className="space-y-5">
                                        {Object.entries(variationsByAttribute).map(([attrId, group]) => (
                                            <div key={attrId}>
                                                <h5 className="text-sm font-semibold text-gray-800 mb-3 block">
                                                    {group.name}
                                                </h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {group.variations.map((variation) => {
                                                        const isSelected =
                                                            selectedVariations[Number(attrId)]?.id === variation.id;
                                                        const showPriceHint =
                                                            variation.price &&
                                                            parseFloat(String(variation.price)) !== product.sale_price;
                                                        const isOutOfStock =
                                                            !product.is_preorder &&
                                                            variation.stock !== null &&
                                                            variation.stock !== undefined &&
                                                            variation.stock <= 0;

                                                        if (isOutOfStock) {
                                                            return (
                                                                <button
                                                                    key={variation.id}
                                                                    onClick={() => {
                                                                        if (onRequestVariation) {
                                                                            const attrName = group.name;
                                                                            onRequestVariation(`${attrName}: ${variation.value}`);
                                                                        } else {
                                                                            toast.error("This option is out of stock.");
                                                                        }
                                                                    }}
                                                                    className={`relative py-2.5 pr-4 text-sm border transition-all flex items-center gap-2 font-medium ${
                                                                        variation.image ? "pl-2" : "pl-4"
                                                                    } border-brand-primary/25 bg-brand-bg text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/35 rounded-lg cursor-pointer`}
                                                                    title="Out of stock – click to request"
                                                                >
                                                                    {variation.image && (
                                                                        <img
                                                                            src={getAssetUrl(variation.image)}
                                                                            alt={variation.value}
                                                                            className="w-6 h-6 rounded object-cover bg-white pointer-events-none shrink-0 relative z-10 grayscale opacity-70"
                                                                        />
                                                                    )}
                                                                    <span className="relative z-10 flex items-center gap-1.5">
                                                                        {variation.value}
                                                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded-sm border border-brand-primary/20">
                                                                            <Bell size={8} />
                                                                            Request
                                                                        </span>
                                                                    </span>
                                                                    {showPriceHint && (
                                                                        <span className="text-xs font-normal ml-0.5 relative z-10 opacity-60">
                                                                            ({formatPrice(variation.price!)})
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            );
                                                        }

                                                        return (
                                                            <button
                                                                key={variation.id}
                                                                onClick={() => handleVariationSelect(Number(attrId), variation)}
                                                                className={`relative py-2.5 pr-4 text-sm border transition-all flex items-center gap-2 font-medium ${
                                                                    variation.image ? "pl-2" : "pl-4"
                                                                } ${
                                                                    isSelected
                                                                        ? "border-brand-primary bg-brand-bg text-brand-primary shadow-sm ring-1 ring-brand-primary"
                                                                        : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                                                                } rounded-lg`}
                                                            >
                                                                {variation.image && (
                                                                    <img
                                                                        src={getAssetUrl(variation.image)}
                                                                        alt={variation.value}
                                                                        className="w-6 h-6 rounded object-cover bg-white pointer-events-none shrink-0 relative z-10"
                                                                    />
                                                                )}
                                                                <span className="relative z-10 flex items-center gap-1.5">
                                                                    {variation.value}
                                                                </span>
                                                                {showPriceHint && (
                                                                    <span className="text-xs font-normal ml-0.5 relative z-10 opacity-70">
                                                                        ({formatPrice(variation.price!)})
                                                                    </span>
                                                                )}
                                                                {isSelected && (
                                                                    <Check size={14} strokeWidth={3} className="relative z-10" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Out-of-stock combination prompt */}
                                    {isOutOfStockCombo && (
                                        <div className="mt-4 rounded-xl border border-brand-primary/20 bg-brand-bg p-4">
                                            <p className="text-sm font-bold text-brand-dark mb-1">
                                                This combination is out of stock
                                            </p>
                                            <p className="text-xs text-brand-primary/90 mb-3">
                                                <span className="font-medium">{buildVariationLabel(selectedVariations)}</span>
                                                {" "}— submit a request and we'll contact you.
                                            </p>
                                            {onRequestVariation && (
                                                <button
                                                    onClick={() => onRequestVariation(buildVariationLabel(selectedVariations))}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold rounded-lg transition-colors"
                                                >
                                                    <Bell size={14} />
                                                    Request This Combination
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Helper Text */}
                                    <div className="mt-4 text-xs text-gray-500 italic">
                                        Select options to automatically add them
                                        to your list below.
                                    </div>

                                    {/* Batch List Display */}
                                    <div className="mt-4 border-t border-gray-100 pt-4">
                                        <h5 className="font-semibold text-gray-900 mb-3 text-sm flex items-center justify-between">
                                            <span>Your Selection </span>
                                            {cartBatch.length > 0 && (
                                                <span className="text-brand-primary text-xs font-normal">
                                                    {cartBatch.length} items
                                                </span>
                                            )}
                                        </h5>

                                        {cartBatch.length === 0 ? (
                                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">
                                                No items selected yet.
                                            </div>
                                        ) : (
                                            <div className="space-y-3 px-1">
                                                {cartBatch.map(
                                                    (item, index) => {
                                                        // Calculate price for this specific row
                                                        const prices =
                                                            item.variations
                                                                .map((v) =>
                                                                    v.price
                                                                        ? parseFloat(
                                                                              String(
                                                                                  v.price,
                                                                              ),
                                                                          )
                                                                        : null,
                                                                )
                                                                .filter(
                                                                    (p) =>
                                                                        p !==
                                                                        null,
                                                                ) as number[];
                                                        const itemPrice =
                                                            prices.length > 0
                                                                ? Math.max(
                                                                      ...prices,
                                                                  )
                                                                : product.sale_price;

                                                        // Highlight if matches current selection?
                                                        const isCurrent =
                                                            isAllSelected &&
                                                            Object.values(
                                                                selectedVariations,
                                                            ).every((v) =>
                                                                item.variations.some(
                                                                    (iv) =>
                                                                        iv.id ===
                                                                        v.id,
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
                                                                            .map(
                                                                                (
                                                                                    v,
                                                                                ) => {
                                                                                    const attrName =
                                                                                        v
                                                                                            .product_attribute
                                                                                            ?.name ||
                                                                                        v
                                                                                            .attribute
                                                                                            ?.name ||
                                                                                        "Option";
                                                                                    return `${attrName}: ${v.value}`;
                                                                                },
                                                                            )
                                                                            .join(
                                                                                ", ",
                                                                            )}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-0.5 font-medium">
                                                                        {formatPrice(
                                                                            itemPrice,
                                                                        )}{" "}
                                                                        ×{" "}
                                                                        {
                                                                            item.quantity
                                                                        }{" "}
                                                                        ={" "}
                                                                        {formatPrice(
                                                                            itemPrice *
                                                                                item.quantity,
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Quantity Control */}
                                                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleBatchQuantityUpdate(
                                                                                index,
                                                                                item.quantity -
                                                                                    1,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            item.quantity <=
                                                                            1
                                                                        }
                                                                        className={`w-8 h-full flex items-center justify-center rounded-l-lg transition-colors ${
                                                                            item.quantity <=
                                                                            1
                                                                                ? "text-gray-300 cursor-not-allowed"
                                                                                : "hover:bg-gray-100 text-gray-600"
                                                                        }`}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="w-8 text-center text-sm font-bold text-gray-900 leading-none">
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleBatchQuantityUpdate(
                                                                                index,
                                                                                item.quantity +
                                                                                    1,
                                                                            )
                                                                        }
                                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded-r-lg transition-colors"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>

                                                                <button
                                                                    onClick={() =>
                                                                        handleRemoveFromBatch(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className="text-gray-400 hover:text-brand-primary p-1.5 hover:bg-brand-bg rounded-md transition-colors"
                                                                    title="Remove"
                                                                >
                                                                    <X
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Total Summary */}
                                    {cartBatch.length > 0 && (
                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 text-sm">
                                            <span className="text-gray-500">
                                                {" "}
                                                Total Amount(
                                                {batchTotalQuantity}{" "}
                                                items):{" "}
                                            </span>
                                            <span className="font-bold text-gray-900 text-lg">
                                                {" "}
                                                {formatPrice(
                                                    batchTotalPrice,
                                                )}{" "}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Sticky Footer */}
                                <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-gray-100 flex flex-col gap-3">
                                    {isOutOfStockCombo && cartBatch.length === 0 ? (
                                        <>
                                            {onRequestVariation && (
                                                <button
                                                    type="button"
                                                    onClick={() => onRequestVariation(buildVariationLabel(selectedVariations))}
                                                    className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent px-4 py-3.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary/90 shadow-md transition-all transform active:scale-[0.98]"
                                                >
                                                    <Bell size={16} />
                                                    Request This Combination
                                                </button>
                                            )}
                                            <button
                                                onClick={onClose}
                                                className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className={`w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent px-4 py-3.5 text-sm font-bold text-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2 transition-all transform active:scale-[0.98] ${
                                                    cartBatch.length > 0
                                                        ? "bg-brand-primary hover:bg-brand-primary/90 hover:shadow-lg shadow-brand-primary/30"
                                                        : "bg-gray-300 cursor-not-allowed"
                                                }`}
                                                onClick={handleBuyNow}
                                                disabled={cartBatch.length === 0}
                                            >
                                                <Zap size={16} strokeWidth={2.5} />
                                                {cartBatch.length > 0
                                                    ? `Buy Now (${batchTotalQuantity} items)`
                                                    : "Select Options to Start"}
                                            </button>
                                            <button
                                                type="button"
                                                className={`w-full inline-flex justify-center items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all transform active:scale-[0.98] ${
                                                    cartBatch.length > 0
                                                        ? "bg-white border-2 border-slate-200 hover:border-brand-dark/40 text-brand-dark hover:bg-slate-50"
                                                        : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                                onClick={handleAddToCart}
                                                disabled={cartBatch.length === 0}
                                            >
                                                <ShoppingCart size={16} strokeWidth={2.5} />
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
export default ProductVariationModal;
