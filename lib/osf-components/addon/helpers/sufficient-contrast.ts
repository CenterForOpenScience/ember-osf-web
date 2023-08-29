import { helper } from '@ember/component/helper';

/**
 * Criteria is based on WCAG 2.0 Guidelines.
 * https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0#qr-visual-audio-contrast-contrast
 *
 * Relative Luminance is calculated using the formula from WCAG 2.0 Guidelines.
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 *
 * @param {Array} backgroundColor The background color in hex format
 * @param {Array} foregroundColor The foreground color in hex format
 * @param {Object} options {largeText: true if text is at least 18 point if not bold and at least 14 point if bold}
 * @return {Boolean} Whether the contrast between the two colors is sufficient
 */

const wcagAA = {
    normalText: 4.5,
    largeText: 3,
};
const wcagAAA = {
    normalText: 7,
    largeText: 4.5,
};

function threeDigitHexToSixDigit(hex: string): string {
    if (hex.length === 3) {
        return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return hex;
}

export function sufficientContrast(
    [backgroundColor, foregroundColor]: [string, string], { largeText = false, useAAA = false },
): boolean {
    const standard = useAAA ? wcagAAA : wcagAA;
    const threshold = largeText ? standard.largeText : standard.normalText;

    if (!backgroundColor || !foregroundColor) {
        return false;
    }

    let bg = backgroundColor.replace('#', '');
    let fg = foregroundColor.replace('#', '');
    bg = bg.length === 3 ? threeDigitHexToSixDigit(bg) : bg;
    fg = fg.length === 3 ? threeDigitHexToSixDigit(fg) : fg;

    // convert background and foreground color hex to sRGB
    const bgSRGB = {
        r: parseInt('0x' + bg.substring(0, 2), 16) / 255,
        g: parseInt('0x' + bg.substring(2, 4), 16) / 255,
        b: parseInt('0x' + bg.substring(4, 6), 16) / 255,
    };
    const fgSRGB = {
        r: parseInt('0x' + fg.substring(0, 2), 16) / 255,
        g: parseInt('0x' + fg.substring(2, 4), 16) / 255,
        b: parseInt('0x' + fg.substring(4, 6), 16) / 255,
    };

    const bgRGBLuminance = {
        r: bgSRGB.r <= 0.03928 ? bgSRGB.r / 12.92 : Math.pow((bgSRGB.r + 0.055) / 1.055, 2.4),
        g: bgSRGB.g <= 0.03928 ? bgSRGB.g / 12.92 : Math.pow((bgSRGB.g + 0.055) / 1.055, 2.4),
        b: bgSRGB.b <= 0.03928 ? bgSRGB.b / 12.92 : Math.pow((bgSRGB.b + 0.055) / 1.055, 2.4),
    };
    const fgRGBLuminance = {
        r: fgSRGB.r <= 0.03928 ? fgSRGB.r / 12.92 : Math.pow((fgSRGB.r + 0.055) / 1.055, 2.4),
        g: fgSRGB.g <= 0.03928 ? fgSRGB.g / 12.92 : Math.pow((fgSRGB.g + 0.055) / 1.055, 2.4),
        b: fgSRGB.b <= 0.03928 ? fgSRGB.b / 12.92 : Math.pow((fgSRGB.b + 0.055) / 1.055, 2.4),
    };

    // calculate relative luminance
    const bgLuminance = 0.2126 * bgRGBLuminance.r + 0.7152 * bgRGBLuminance.g + 0.0722 * bgRGBLuminance.b;
    const fgLuminance = 0.2126 * fgRGBLuminance.r + 0.7152 * fgRGBLuminance.g + 0.0722 * fgRGBLuminance.b;

    // calculate contrast ratio
    const contrastRatio = (Math.max(bgLuminance, fgLuminance) + 0.05) / (Math.min(bgLuminance, fgLuminance) + 0.05);
    return contrastRatio >= threshold;
}

export default helper(sufficientContrast);
