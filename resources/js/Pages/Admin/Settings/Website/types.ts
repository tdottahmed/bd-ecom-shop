export interface DeliveryCharge {
    id?: number;
    name: string;
    cost: number | string;
    duration: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface WebsiteSetting {
    smtp_host?: string | null;
    smtp_port?: string | null;
    smtp_username?: string | null;
    smtp_password?: string | null;
    smtp_encryption?: string | null;
    smtp_from_address?: string | null;
    smtp_from_name?: string | null;
    banner_active: boolean;
    banner_images: string[];
    site_logo: string | null;
    site_favicon: string | null;
    auth_page_image: string | null;
    footer_description: string | null;
    social_facebook: string | null;
    social_instagram: string | null;
    social_youtube: string | null;
    social_tiktok: string | null;
    whatsapp_link?: string | null;
    faqs?: FAQ[];
    contact_address?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    contact_hours?: string | null;
    contact_map_embed?: string | null;
    about_stats?: { value: string; label: string }[];
    about_testimonials?: { name: string; role: string; quote: string; rating: number }[];
    cta_enabled?: boolean;
    customer_auth_enabled?: boolean;
    blog_enabled?: boolean;
    cta_title?: string | null;
    cta_description?: string | null;
    cta_browse_text?: string | null;
    cta_browse_link?: string | null;
    cta_contact_text?: string | null;
    cta_contact_link?: string | null;
}

