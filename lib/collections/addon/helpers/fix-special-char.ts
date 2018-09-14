import { helper } from '@ember/component/helper';
import fixSpecialChars from 'ember-osf-web/utils/fix-special-char';

/**
 * Apply the `fix-special-char` utility function to clean up malformed text sent from the server.
 *
 * Usage example:
 * ```handlebars
 *    This is text we want to fix: {{fix-special-char 'Now &amp; then'}}
 * ```
 */
export function fixSpecialCharHelper([inputString]: [string]): string {
    return fixSpecialChars(inputString);
}

export default helper(fixSpecialCharHelper);
