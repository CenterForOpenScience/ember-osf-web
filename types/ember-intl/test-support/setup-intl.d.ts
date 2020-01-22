import { Translations } from './add-translations';

/**
 * Calling this helper will install a special `missing-message` util that will
 * serialize all missing translations in a deterministic manner, including
 * variables you've passed for interpolation. This means that you do not have
 * to explicitly add any translations and can just rely on the implicit
 * serialization. See the docs for detailed examples.
 *
 * Besides the `hooks` object you can also pass a `locale` string or array to
 * set the locale, as well as an object of `translations`, if you do want to
 * bootstrap translations. Both arguments are optional.
 */
export default function setupIntl(
    hooks: NestedHooks,
    locale?: string | string[],
    translations?: Translations,
): void;
export default function setupIntl(
    hooks: NestedHooks,
    translations?: Translations,
): void;
