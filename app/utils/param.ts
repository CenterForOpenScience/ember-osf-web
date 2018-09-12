export default function(params: { [k: string]: string }) {
    return Object.entries(params).map(
        entry => entry.map(comp => encodeURIComponent(comp)).join('='),
    ).join('&');
}
