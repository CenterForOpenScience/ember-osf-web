export default function param(params: Record<string, string>) {
    return Object.entries(params).map(
        entry => entry.map(comp => encodeURIComponent(comp)).join('='),
    ).join('&');
}
