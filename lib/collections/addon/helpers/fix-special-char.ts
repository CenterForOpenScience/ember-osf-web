import { helper } from '@ember/component/helper';

/**
 * Apply the `fix-special-char` utility function to clean up malformed text sent from the server.
 *
 * Usage example:
 * ```handlebars
 *    This is text we want to fix: {{fix-special-char 'Now &amp; then'}}
 * ```
 */
export function fixSpecialChar([inputString]: [string]): string {
    return inputString ?
        inputString
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>') :
        '';
}

export default helper(fixSpecialChar);
