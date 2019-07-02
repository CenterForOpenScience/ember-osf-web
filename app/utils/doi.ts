import { assert } from '@ember/debug';

export const DOIRegex = /\b(10\.\d{4,}(?:\.\d+)*\/\S+(?:(?!["&'<>])\S))\b/;
export const DOIUrlPrefix = 'https://doi.org/';
export const DOIPlaceholder = '10.xxxx/xxxxx';

export function extractDoi(doi: string) {
    const doiOnly = DOIRegex.exec(doi);
    return doiOnly && doiOnly[0];
}

export function validateDoi(doi: string): boolean {
    return DOIRegex.test(doi);
}

export function formatDoiAsUrl(doi: string) {
    assert(`Invalid DOI. ${doi} should be in the format: ${DOIPlaceholder}`, validateDoi(doi));
    return `${DOIUrlPrefix}${doi}`;
}
