import type { Section } from "./types";
import { DEFAULT_DESIGN } from "./constants";

export const uid = () => Math.random().toString(36).slice(2, 9);

export const toSlug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const normalizeSection = (s: any): Section => ({
    ...s,
    design: { ...DEFAULT_DESIGN, ...(s.design ?? {}) },
});
