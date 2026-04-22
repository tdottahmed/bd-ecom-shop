export type ThemeColorKey =
    | "primary"
    | "tint"
    | "dark"
    | "accent"
    | "success"
    | "bg"
    | "ivory";

export type ThemeColors = Record<ThemeColorKey, string>;

export const THEME_COLOR_KEYS: ThemeColorKey[] = [
    "primary",
    "tint",
    "dark",
    "accent",
    "success",
    "bg",
    "ivory",
];

/** Mirrors `default_theme_colors()` in PHP */
export const DEFAULT_THEME_COLORS: ThemeColors = {
    primary: "#E11D6D",
    tint: "#F87BB4",
    dark: "#1A111A",
    accent: "#FF9545",
    success: "#16B57D",
    bg: "#FFEBF2",
    ivory: "#FDF9F4",
};

const HEX_RE = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

export function normalizeHex(hex: string, fallback: string): string {
    const t = hex.trim();
    if (!HEX_RE.test(t)) {
        return fallback;
    }
    if (t.length === 4) {
        const h = t.slice(1);
        return (
            "#" +
            h[0] +
            h[0] +
            h[1] +
            h[1] +
            h[2] +
            h[2]
        ).toUpperCase();
    }
    return t.toUpperCase();
}

export function hexToRgbChannels(hex: string): string {
    const n = normalizeHex(hex, "#000000").replace("#", "");
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
}

/**
 * Writes CSS variables on `:root` so Tailwind `brand-*` and legacy `var(--brand-*)` update live.
 */
export function applyThemeColors(colors: Partial<ThemeColors> | ThemeColors): void {
    if (typeof document === "undefined") {
        return;
    }
    const root = document.documentElement;
    for (const key of THEME_COLOR_KEYS) {
        const raw = colors[key];
        const hex = raw
            ? normalizeHex(raw, DEFAULT_THEME_COLORS[key])
            : DEFAULT_THEME_COLORS[key];
        root.style.setProperty(`--color-brand-${key}`, hexToRgbChannels(hex));
        root.style.setProperty(`--brand-${key}`, hex);
    }
}

export const THEME_COLOR_LABELS: Record<
    ThemeColorKey,
    { label: string; hint: string }
> = {
    primary: {
        label: "Primary",
        hint: "Main CTAs, links, and key actions on the storefront.",
    },
    tint: {
        label: "Tint",
        hint: "Secondary highlights, icons, and soft accents.",
    },
    dark: {
        label: "Dark",
        hint: "Dark buttons and high-contrast surfaces.",
    },
    accent: {
        label: "Accent",
        hint: "Promos, badges, and secondary emphasis.",
    },
    success: {
        label: "Success",
        hint: "Stock badges, confirmations, and positive states.",
    },
    bg: {
        label: "Background tint",
        hint: "Light fills behind cards and navigation hover states.",
    },
    ivory: {
        label: "Page base",
        hint: "Overall page background on customer-facing pages.",
    },
};
