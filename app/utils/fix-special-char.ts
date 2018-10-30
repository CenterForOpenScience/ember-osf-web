/**
 * This function is useful for fixing a bad API behavior. In certain cases the server will insert HTML escape
 * sequences into text, and this will replace `&amp;` sequences with `&`, `&lt;` with `<` and `&gt;` with `>`.
 * Template helper and ember-data field versions of this function are available.
 */
export default function fixSpecialChar(inputString: string = ''): string {
    return inputString
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');
}
