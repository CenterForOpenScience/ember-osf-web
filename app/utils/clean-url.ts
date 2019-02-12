/**
 * Remove the --guidtype portions of a URL that are only used for guid routing
 * and should never appear in a real URL.
 */
export default function cleanURL(url: string) {
    return url.replace(/(?:^|\/)--[^/]+/g, '');
}
