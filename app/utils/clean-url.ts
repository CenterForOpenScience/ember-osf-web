import { assert } from '@ember/debug';
/**
 * Remove the --guidtype portions of a URL that are only used for guid routing
 * and should never appear in a real URL.
 */
export default function cleanURL(url: string) {
    assert(`cleanURL expects a path starting with '/', got '${url}'`, url.startsWith('/'));

    const cleanedURL = url
        .replace(/(?:^|\/)--[^/?]+/g, '') // remove '--foo' segments
        .replace(/\/(?=$|[?#])/, ''); // remove trailing slash

    return cleanedURL.startsWith('/') ? cleanedURL : `/${cleanedURL}`;
}

/**
 * Return a path suitable for passing to one of the various `not-found` routes.
 */
export function notFoundURL(url: string) {
    return cleanURL(url)
        .slice(1) // remove leading '/'
        .replace(/\?[^#]*/, ''); // remove query string to avoid duplicated query params
}
