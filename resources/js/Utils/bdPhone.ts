/**
 * Bangladesh mobile: local form 01[3-9]XXXXXXX (11 digits).
 * Display with +880 uses 10 digits after country code (drop leading 0).
 */

const MAX_LOCAL = 11;
const MAX_NATIONAL = 10;

export function stripDigits(value: string): string {
    return value.replace(/\D/g, "");
}

/** Parse pasted or typed value into local 01XXXXXXXXX (max 11 digits). */
export function normalizeToLocalBdPhone(raw: string): string {
    let d = stripDigits(raw);
    if (d.startsWith("880") && d.length >= 12) {
        d = "0" + d.slice(3);
    }
    if (d.length === MAX_NATIONAL && d.startsWith("1")) {
        d = "0" + d;
    }
    if (d.length > MAX_LOCAL) {
        d = d.slice(0, MAX_LOCAL);
    }
    return d;
}

/** 01712345678 → 1712345678 for display after +880 */
export function localToNationalDigits(local: string): string {
    const d = normalizeToLocalBdPhone(local);
    if (d.startsWith("01") && d.length >= 2) {
        return d.slice(1).slice(0, MAX_NATIONAL);
    }
    if (d.startsWith("0") && d.length > 1) {
        return d.slice(1).slice(0, MAX_NATIONAL);
    }
    return d.slice(0, MAX_NATIONAL);
}

/** Digits typed after +880 → local 01XXXXXXXXX */
export function nationalDigitsToLocal(national: string): string {
    const d = stripDigits(national);
    if (!d) return "";
    if (d.length >= 11 || d.startsWith("880")) {
        return normalizeToLocalBdPhone(d).slice(0, MAX_LOCAL);
    }
    if (d.startsWith("01")) {
        return normalizeToLocalBdPhone(d).slice(0, MAX_LOCAL);
    }
    const core = d.slice(0, MAX_NATIONAL);
    if (core.startsWith("1")) {
        return ("0" + core).slice(0, MAX_LOCAL);
    }
    return ("0" + core).slice(0, MAX_LOCAL);
}

/** Format 1712345678 as "1712 345 678" for display in the national segment */
export function formatNationalSegmentDisplay(nationalDigits: string): string {
    const d = stripDigits(nationalDigits).slice(0, MAX_NATIONAL);
    if (d.length <= 4) return d;
    if (d.length <= 7) {
        return `${d.slice(0, 4)} ${d.slice(4)}`;
    }
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

/** True if complete valid BD mobile local form */
export function isValidBdLocalPhone(local: string): boolean {
    return /^01[3-9]\d{8}$/.test(normalizeToLocalBdPhone(local));
}
