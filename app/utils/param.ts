export default function(params: Record<string, string>) {
    return Object.entries(params).map(
        entry => entry.map(comp => encodeURIComponent(comp)).join('='),
    ).join('&');
}
