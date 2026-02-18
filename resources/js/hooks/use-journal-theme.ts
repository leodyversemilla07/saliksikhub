import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps, ThemeSettings } from '@/types';

/**
 * Converts a hex color string (#RRGGBB) to oklch CSS format.
 *
 * Uses the sRGB -> linear RGB -> OKLab -> OKLCh pipeline.
 * Returns a string like "0.637 0.218 29.234" suitable for
 * oklch(L C H) CSS usage.
 */
function hexToOklch(hex: string): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;

    // sRGB to linear RGB
    const toLinear = (c: number) =>
        c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const lr = toLinear(r);
    const lg = toLinear(g);
    const lb = toLinear(b);

    // Linear RGB to OKLab (using the Björn Ottosson method)
    const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

    const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const bOk = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    // OKLab to OKLCh
    const C = Math.sqrt(a * a + bOk * bOk);
    let H = Math.atan2(bOk, a) * (180 / Math.PI);
    if (H < 0) {
        H += 360;
    }

    // Round to 3 decimal places for CSS
    const lRounded = Math.round(L * 1000) / 1000;
    const cRounded = Math.round(C * 1000) / 1000;
    const hRounded = Math.round(H * 1000) / 1000;

    return `${lRounded} ${cRounded} ${hRounded}`;
}

/**
 * Generates dark mode variants from light mode hex colors.
 * Adjusts lightness: light colors become dark and vice versa.
 */
function generateDarkVariant(hex: string, role: string): string {
    const h = hex.replace('#', '');
    let r = parseInt(h.substring(0, 2), 16);
    let g = parseInt(h.substring(2, 4), 16);
    let b = parseInt(h.substring(4, 6), 16);

    // Convert to HSL for easier manipulation
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let hue = 0;
    let sat = 0;
    let light = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        sat = light > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case rNorm:
                hue = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
                break;
            case gNorm:
                hue = ((bNorm - rNorm) / d + 2) / 6;
                break;
            case bNorm:
                hue = ((rNorm - gNorm) / d + 4) / 6;
                break;
        }
    }

    // Adjust lightness based on the role
    switch (role) {
        case 'background':
            light = 0.09; // Very dark background
            break;
        case 'foreground':
            light = 0.93; // Very light text
            break;
        case 'card':
            light = 0.12;
            break;
        case 'card_foreground':
            light = 0.93;
            break;
        case 'primary':
            // Keep hue/saturation, boost lightness for dark mode readability
            light = Math.max(light, 0.55);
            sat = Math.min(sat * 1.1, 1);
            break;
        case 'primary_foreground':
            light = light > 0.5 ? 0.1 : 0.95;
            break;
        case 'secondary':
            light = 0.16;
            break;
        case 'secondary_foreground':
            light = 0.93;
            break;
        case 'accent':
            light = 0.16;
            sat = Math.min(sat * 0.8, 1);
            break;
        case 'accent_foreground':
            light = 0.93;
            break;
        case 'muted':
            light = 0.16;
            sat = Math.min(sat * 0.3, 1);
            break;
        case 'muted_foreground':
            light = 0.55;
            break;
        case 'border':
            light = 0.18;
            sat = Math.min(sat * 0.2, 1);
            break;
        default:
            // Invert lightness for unknown roles
            light = 1 - light;
            break;
    }

    // HSL to hex
    const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
        if (s === 0) {
            const v = Math.round(l * 255);
            return [v, v, v];
        }

        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) { t += 1; }
            if (t > 1) { t -= 1; }
            if (t < 1 / 6) { return p + (q - p) * 6 * t; }
            if (t < 1 / 2) { return q; }
            if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return [
            Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
            Math.round(hue2rgb(p, q, h) * 255),
            Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
        ];
    };

    const [rr, gg, bb] = hslToRgb(hue, sat, light);
    const toHex = (v: number) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, '0');
    return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
}

/**
 * Map of CSS custom property names to theme_settings color keys.
 * These are the CSS variables defined in app.css that Tailwind uses.
 */
const COLOR_VAR_MAP: Record<string, keyof ThemeSettings['colors']> = {
    '--primary': 'primary',
    '--primary-foreground': 'primary_foreground',
    '--secondary': 'secondary',
    '--secondary-foreground': 'secondary_foreground',
    '--accent': 'accent',
    '--background': 'background',
    '--foreground': 'foreground',
    '--muted': 'muted',
    '--muted-foreground': 'muted_foreground',
    '--border': 'border',
};

/**
 * Extended color derivations: CSS vars that should inherit from
 * the base theme colors when not explicitly set.
 */
const DERIVED_VARS: Record<string, keyof ThemeSettings['colors']> = {
    '--card': 'background',
    '--card-foreground': 'foreground',
    '--popover': 'background',
    '--popover-foreground': 'foreground',
    '--accent-foreground': 'foreground',
    '--input': 'border',
    '--ring': 'primary',
    '--sidebar': 'background',
    '--sidebar-foreground': 'foreground',
    '--sidebar-primary': 'primary',
    '--sidebar-primary-foreground': 'primary_foreground',
    '--sidebar-accent': 'accent',
    '--sidebar-accent-foreground': 'foreground',
    '--sidebar-border': 'border',
    '--sidebar-ring': 'primary',
};

/**
 * Tracks which CSS properties we've set so we can clean up
 * when the journal changes or component unmounts.
 */
const managedProperties: string[] = [];

/**
 * Applies theme CSS custom properties to the document root element.
 * This overrides the defaults set in app.css.
 */
function applyTheme(themeSettings: ThemeSettings): void {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const colors = themeSettings.colors;

    // Clear previously managed properties
    clearTheme();

    // Apply direct color mappings
    for (const [cssVar, colorKey] of Object.entries(COLOR_VAR_MAP)) {
        const hex = colors[colorKey];
        if (hex) {
            const lightValue = hexToOklch(hex);
            const darkHex = generateDarkVariant(hex, colorKey);
            const darkValue = hexToOklch(darkHex);

            // Set light mode value on :root
            root.style.setProperty(cssVar, `oklch(${lightValue})`);
            // Set dark mode value via a data attribute approach
            root.style.setProperty(`${cssVar}-light`, `oklch(${lightValue})`);
            root.style.setProperty(`${cssVar}-dark`, `oklch(${darkValue})`);

            managedProperties.push(cssVar, `${cssVar}-light`, `${cssVar}-dark`);
        }
    }

    // Apply derived color mappings
    for (const [cssVar, sourceKey] of Object.entries(DERIVED_VARS)) {
        const hex = colors[sourceKey];
        if (hex) {
            const varName = cssVar.replace('--', '');
            const darkHex = generateDarkVariant(hex, varName.replace(/-/g, '_'));
            const lightValue = hexToOklch(hex);
            const darkValue = hexToOklch(darkHex);

            root.style.setProperty(cssVar, `oklch(${lightValue})`);
            root.style.setProperty(`${cssVar}-light`, `oklch(${lightValue})`);
            root.style.setProperty(`${cssVar}-dark`, `oklch(${darkValue})`);

            managedProperties.push(cssVar, `${cssVar}-light`, `${cssVar}-dark`);
        }
    }

    // Apply current mode (light or dark)
    applyModeColors(isDark);

    // Typography
    const { typography } = themeSettings;
    if (typography.font_family) {
        root.style.setProperty('--font-sans', `'${typography.font_family}', system-ui, sans-serif`);
        managedProperties.push('--font-sans');
    }
    if (typography.heading_font) {
        root.style.setProperty('--font-serif', `'${typography.heading_font}', Georgia, serif`);
        managedProperties.push('--font-serif');
    }
    if (typography.base_size) {
        root.style.fontSize = typography.base_size;
        managedProperties.push('font-size');
    }
}

/**
 * Applies either light or dark color values based on the current mode.
 */
function applyModeColors(isDark: boolean): void {
    const root = document.documentElement;
    const suffix = isDark ? '-dark' : '-light';

    const allVars = [...Object.keys(COLOR_VAR_MAP), ...Object.keys(DERIVED_VARS)];

    for (const cssVar of allVars) {
        const value = root.style.getPropertyValue(`${cssVar}${suffix}`);
        if (value) {
            root.style.setProperty(cssVar, value);
        }
    }
}

/**
 * Removes all theme CSS properties that were set by applyTheme.
 */
function clearTheme(): void {
    const root = document.documentElement;
    for (const prop of managedProperties) {
        if (prop === 'font-size') {
            root.style.removeProperty('font-size');
        } else {
            root.style.removeProperty(prop);
        }
    }
    managedProperties.length = 0;
}

/**
 * React hook that reads the current journal's theme_settings from
 * Inertia shared props and applies them as CSS custom properties.
 *
 * Only applies on public-facing pages (not admin). Automatically
 * cleans up when the journal changes or the component unmounts.
 *
 * Also watches for dark mode class changes and reapplies the
 * appropriate color values.
 */
export function useJournalTheme(): void {
    const { currentJournal } = usePage<PageProps>().props;
    const themeSettings = currentJournal?.theme_settings ?? null;
    const observerRef = useRef<MutationObserver | null>(null);

    useEffect(() => {
        if (!themeSettings) {
            clearTheme();
            return;
        }

        applyTheme(themeSettings);

        // Watch for dark mode class changes on <html>
        observerRef.current = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'class'
                ) {
                    const isDark = document.documentElement.classList.contains('dark');
                    applyModeColors(isDark);
                }
            }
        });

        observerRef.current.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            clearTheme();
            observerRef.current?.disconnect();
        };
    }, [themeSettings]);
}

export default useJournalTheme;
