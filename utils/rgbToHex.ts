export function rgbToHex(r: number, g: number, b: number) {
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}