import { helper } from '@ember/component/helper';

/**
 * Returns an unique-enough string for use in a DOM element's `id`.
 * We should usually avoid `id` but there are exceptions (eg `<label for=? >`).
 * (unique-id) provides a locally-scoped value for a globally-scoped bucket.
 *
 * example:
 * ```hbs
 * {{#let (unique-id) as |inputId|}}
 *   <label for={{inputId}}>What is your face?</label>
 *
 *   <input id={{inputId}} type='face' />
 * {{/let}}
 * ```
 *
 * Accepts prefixes if you want -- `(unique-id 'foo')` returns `'foo-<UUID>'`.
 */
export function uniqueId(prefixes: unknown[]): string {
    return [
        ...prefixes,
        Math.random().toString().replace('.', ''),
    ].join('-');
}

export default helper(uniqueId);
