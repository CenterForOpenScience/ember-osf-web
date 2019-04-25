export default function slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/["'.]+/g, '');
}
