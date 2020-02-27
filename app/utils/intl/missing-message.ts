export default function missingMessage(key: string, locales: string|string[], _: object) {
    return `[ember-intl] Missing translation for key: "${key}" for locales: "${locales}"`;
}
