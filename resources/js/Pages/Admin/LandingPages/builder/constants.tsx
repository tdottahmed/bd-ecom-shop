import {
    AlignLeft, Zap, LayoutGrid, Video, Star, Table, HelpCircle,
    Megaphone, Shield, Timer, Tag, GitCompare,
    Settings2, Layout, Type,
} from "lucide-react";
import type { SectionType, HeroLayout, LayoutStyle, SectionDesign, PanelTab } from "./types";

export const DEFAULT_DESIGN: SectionDesign = {
    bg_color: "", text_color: "", padding: "md", align: "left", layout_style: "default",
};

export const LAYOUT_STYLES: { value: LayoutStyle; label: string; preview: React.ReactNode }[] = [
    {
        value: "default",
        label: "Default",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#1E2826"/>
                <rect x="8" y="11" width="22" height="3" rx="1" fill="#374151"/>
                <rect x="8" y="17" width="16" height="2" rx="1" fill="#374151" opacity="0.5"/>
            </svg>
        ),
    },
    {
        value: "bordered",
        label: "Bordered",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#0C1311"/>
                <rect x="4" y="4" width="40" height="24" rx="3" fill="none" stroke="#2DE3A7" strokeWidth="1.5"/>
                <rect x="12" y="12" width="18" height="2.5" rx="1" fill="#374151"/>
                <rect x="12" y="17" width="12" height="2" rx="1" fill="#374151" opacity="0.5"/>
            </svg>
        ),
    },
    {
        value: "card",
        label: "Card",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#0C1311"/>
                <rect x="6" y="7" width="40" height="22" rx="3" fill="#000" opacity="0.25"/>
                <rect x="4" y="5" width="40" height="22" rx="3" fill="#1a2320"/>
                <rect x="10" y="12" width="16" height="2.5" rx="1" fill="#2DE3A7" opacity="0.5"/>
                <rect x="10" y="17" width="12" height="2" rx="1" fill="#374151"/>
            </svg>
        ),
    },
    {
        value: "accent-left",
        label: "Accent Left",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#1E2826"/>
                <rect x="4" y="5" width="3" height="22" rx="1.5" fill="#2DE3A7"/>
                <rect x="11" y="11" width="22" height="2.5" rx="1" fill="#374151"/>
                <rect x="11" y="16" width="16" height="2" rx="1" fill="#374151" opacity="0.5"/>
            </svg>
        ),
    },
    {
        value: "accent-top",
        label: "Accent Top",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#1E2826"/>
                <rect x="4" y="4" width="40" height="3" rx="1.5" fill="#2DE3A7"/>
                <rect x="12" y="13" width="18" height="2.5" rx="1" fill="#374151"/>
                <rect x="12" y="18" width="14" height="2" rx="1" fill="#374151" opacity="0.5"/>
            </svg>
        ),
    },
    {
        value: "shadow",
        label: "Shadow",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#0C1311"/>
                <rect x="5" y="8" width="40" height="22" rx="3" fill="#000" opacity="0.35"/>
                <rect x="4" y="5" width="40" height="22" rx="3" fill="#1a2320"/>
                <rect x="10" y="12" width="18" height="2.5" rx="1" fill="#374151"/>
                <rect x="10" y="17" width="12" height="2" rx="1" fill="#374151" opacity="0.5"/>
            </svg>
        ),
    },
];

export const SECTION_DEFAULTS: Record<SectionType, Record<string, any>> = {
    description: { title: "About This Product", content: "" },
    features: {
        title: "Key Features",
        items: [{ emoji: "⚡", title: "Feature", description: "Describe it" }],
    },
    gallery:  { title: "Product Gallery", images: [] },
    video:    { title: "See It In Action", url: "", caption: "" },
    reviews:  {
        title: "What Customers Say",
        items: [{ name: "Happy Customer", location: "", rating: 5, text: "Amazing product!" }],
    },
    specs:    { title: "Specifications", rows: [{ label: "Material", value: "" }] },
    faq:      {
        title: "Frequently Asked Questions",
        items: [{ question: "Is this product genuine?", answer: "" }],
    },
    cta:      { headline: "Ready to Order?", subtext: "Limited stock available.", button_text: "Order Now", button_url: "", style: "solid" },
    trust_badges: {
        title: "Trusted & Secure",
        layout: "horizontal",
        badges: [
            { icon: "🔒", label: "Secure Payment" },
            { icon: "🚚", label: "Fast Delivery" },
            { icon: "✅", label: "Genuine Product" },
            { icon: "💯", label: "Money Back" },
        ],
    },
    countdown: { title: "Offer Ends In", end_date: "", subtext: "Don't miss out on this limited-time offer!" },
    pricing: {
        title: "Special Offer",
        currency: "RM",
        original_price: "",
        sale_price: "",
        badge: "🔥 Best Value",
        notes: ["Free shipping included", "30-day return policy", "100% genuine product"],
        button_text: "Buy Now",
        button_url: "",
    },
    comparison: {
        title: "Why Choose Us?",
        our_label: "Our Product",
        their_label: "Others",
        rows: [
            { feature: "Quality", ours: "✅ Premium", theirs: "❌ Standard" },
            { feature: "Support", ours: "✅ 24/7",    theirs: "❌ Limited" },
            { feature: "Warranty", ours: "✅ 1 Year", theirs: "❌ None" },
        ],
    },
};

export const SECTION_META: Record<SectionType, { label: string; icon: React.ReactNode; color: string; bg: string; description: string }> = {
    description:  { label: "Description",   icon: <AlignLeft size={15} />,   color: "text-blue-400",    bg: "bg-blue-500/10",    description: "Rich text content block" },
    features:     { label: "Features",      icon: <Zap size={15} />,          color: "text-yellow-400",  bg: "bg-yellow-500/10",  description: "Icon + title + text list" },
    gallery:      { label: "Gallery",       icon: <LayoutGrid size={15} />,   color: "text-purple-400",  bg: "bg-purple-500/10",  description: "Image grid / lightbox" },
    video:        { label: "Video",         icon: <Video size={15} />,         color: "text-red-400",     bg: "bg-red-500/10",     description: "YouTube / Vimeo embed" },
    reviews:      { label: "Reviews",       icon: <Star size={15} />,          color: "text-amber-400",   bg: "bg-amber-500/10",   description: "Customer testimonials" },
    specs:        { label: "Specs Table",   icon: <Table size={15} />,         color: "text-cyan-400",    bg: "bg-cyan-500/10",    description: "Key-value spec table" },
    faq:          { label: "FAQ",           icon: <HelpCircle size={15} />,   color: "text-green-400",   bg: "bg-green-500/10",   description: "Accordion Q&A" },
    cta:          { label: "CTA Block",     icon: <Megaphone size={15} />,    color: "text-pink-400",    bg: "bg-pink-500/10",    description: "Call-to-action banner" },
    trust_badges: { label: "Trust Badges", icon: <Shield size={15} />,        color: "text-emerald-400", bg: "bg-emerald-500/10", description: "Icons + trust signals" },
    countdown:    { label: "Countdown",     icon: <Timer size={15} />,         color: "text-orange-400",  bg: "bg-orange-500/10",  description: "Urgency countdown timer" },
    pricing:      { label: "Pricing Card",  icon: <Tag size={15} />,           color: "text-violet-400",  bg: "bg-violet-500/10",  description: "Price with discount display" },
    comparison:   { label: "Comparison",    icon: <GitCompare size={15} />,   color: "text-sky-400",     bg: "bg-sky-500/10",     description: "Feature comparison table" },
};

export const HERO_LAYOUTS: { value: HeroLayout; label: string; preview: React.ReactNode }[] = [
    {
        value: "split-right",
        label: "Image Right",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="22" height="30" rx="2" fill="#1E2826" />
                <rect x="3" y="5" width="12" height="3" rx="1" fill="#2DE3A7" opacity="0.8" />
                <rect x="3" y="11" width="18" height="2" rx="1" fill="#374151" />
                <rect x="3" y="15" width="14" height="2" rx="1" fill="#374151" />
                <rect x="3" y="22" width="8" height="4" rx="1" fill="#2DE3A7" opacity="0.6" />
                <rect x="25" y="1" width="22" height="30" rx="2" fill="#1E2826" />
                <rect x="27" y="3" width="18" height="26" rx="2" fill="#374151" opacity="0.6" />
            </svg>
        ),
    },
    {
        value: "split-left",
        label: "Image Left",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="22" height="30" rx="2" fill="#1E2826" />
                <rect x="3" y="3" width="18" height="26" rx="2" fill="#374151" opacity="0.6" />
                <rect x="25" y="1" width="22" height="30" rx="2" fill="#1E2826" />
                <rect x="27" y="5" width="12" height="3" rx="1" fill="#2DE3A7" opacity="0.8" />
                <rect x="27" y="11" width="18" height="2" rx="1" fill="#374151" />
                <rect x="27" y="15" width="14" height="2" rx="1" fill="#374151" />
                <rect x="27" y="22" width="8" height="4" rx="1" fill="#2DE3A7" opacity="0.6" />
            </svg>
        ),
    },
    {
        value: "centered",
        label: "Centered",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#1E2826" />
                <rect x="14" y="5" width="20" height="3" rx="1" fill="#2DE3A7" opacity="0.8" />
                <rect x="10" y="11" width="28" height="2" rx="1" fill="#374151" />
                <rect x="13" y="15" width="22" height="2" rx="1" fill="#374151" />
                <rect x="17" y="22" width="14" height="4" rx="1" fill="#2DE3A7" opacity="0.6" />
            </svg>
        ),
    },
    {
        value: "full-overlay",
        label: "Full Overlay",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#374151" opacity="0.5" />
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#000" opacity="0.4" />
                <rect x="12" y="5" width="24" height="3" rx="1" fill="white" opacity="0.9" />
                <rect x="8" y="11" width="32" height="2" rx="1" fill="white" opacity="0.5" />
                <rect x="15" y="22" width="18" height="4" rx="1" fill="#2DE3A7" opacity="0.8" />
            </svg>
        ),
    },
];

export const FONT_OPTIONS = [
    { value: "",                          label: "Default (Inter)" },
    { value: "'Playfair Display', serif", label: "Playfair Display" },
    { value: "'Poppins', sans-serif",     label: "Poppins" },
    { value: "'Montserrat', sans-serif",  label: "Montserrat" },
    { value: "'Raleway', sans-serif",     label: "Raleway" },
    { value: "'Lato', sans-serif",        label: "Lato" },
    { value: "'Nunito', sans-serif",      label: "Nunito" },
    { value: "'Merriweather', serif",     label: "Merriweather" },
    { value: "'DM Sans', sans-serif",     label: "DM Sans" },
];

export const PANEL_TABS: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
    { id: "page",   label: "Page",   icon: <Settings2 size={14} /> },
    { id: "hero",   label: "Hero",   icon: <Layout size={14} /> },
    { id: "design", label: "Design", icon: <Type size={14} /> },
];
