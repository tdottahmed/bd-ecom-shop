export interface DeliveryCharge {
    id?: number;
    name: string;
    cost: number | string;
    duration: string;
}

export interface WebsiteSetting {
    id: number;
    banner_active: boolean;
    banner_images: string[] | null;
    logo?: string | null;
    favicon?: string | null;
}

