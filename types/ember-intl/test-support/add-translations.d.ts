interface Translations {
    [key: string]: string|Translations;
}

/**
 * Invokes the `addTranslations` method of the `intl` service. The first
 * parameter, the `localeName`, is optional and will default to the last
 * currently enabled locale. This means, that if you invoke this helper with
 * just translations, they will be added to the last locale and all other
 * locales will be tried before.
 */

export default function addTranslations(
    localeName: string,
    translations: Translations,
): void;
export default function addTranslations(translations: Translations): void;
