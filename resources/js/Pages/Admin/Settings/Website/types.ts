export interface DeliveryCharge {
    id?: number;
    name: string;
    cost: number | string;
    duration: string;
}

export interface WebsiteSetting {
    banner_active: boolean;
    banner_images: string[];
    site_logo: string | null;
    site_favicon: string | null;
    footer_description: string | null;
    social_facebook: string | null;
    social_instagram: string | null;
    social_youtube: string | null;
    social_tiktok: string | null;
}

