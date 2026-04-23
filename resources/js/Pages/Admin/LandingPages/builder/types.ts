export type SectionType =
    | "description" | "features" | "gallery" | "video" | "reviews"
    | "specs" | "faq" | "cta" | "trust_badges" | "countdown" | "pricing" | "comparison";

export type HeroLayout = "split-right" | "split-left" | "centered" | "full-overlay";
export type PaddingSize = "sm" | "md" | "lg";
export type TextAlign = "left" | "center" | "right";
export type LayoutStyle = "default" | "bordered" | "card" | "accent-left" | "accent-top" | "shadow";
export type PanelTab = "page" | "hero" | "design";

export interface SectionDesign {
    bg_color: string;
    text_color: string;
    padding: PaddingSize;
    align: TextAlign;
    layout_style: LayoutStyle;
}

export interface Section {
    id: string;
    type: SectionType;
    data: Record<string, any>;
    design: SectionDesign;
}

export interface Product  { id: number; name: string }
export interface Category { id: number; title: string }

export interface LandingPage {
    id: number;
    slug: string;
    page_title: string;
    meta_description: string;
    product_id: number | null;
    category_id: number | null;
    hero_headline: string;
    hero_subheadline: string;
    hero_badge: string;
    hero_image: string | null;
    hero_cta_text: string;
    hero_cta_url: string;
    hero_layout: HeroLayout;
    hero_bg_color: string;
    hero_text_color: string;
    accent_color: string;
    global_bg_color: string;
    global_font_family: string;
    sections: Section[];
    is_published: boolean;
}
