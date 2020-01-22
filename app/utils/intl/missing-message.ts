// import { getOwner } from '@ember/application';
// import { makeArray } from '@ember/array';
// import { get } from '@ember/object';
// import config from 'ember-get-config';
// import Locale from 'ember-intl/utils/locale';

// const fallbackLocale = config.intl.defaultLocale;

// export default function(this: any, locale: string, key: string, data: any) {
//     if (locale === fallbackLocale) {
//         return `Missing translation: ${key}`;
//     }
//     // NOTE This relies on internal APIs and is brittle.
//     // Emulating the internals of ember-intl's translate method.
//
//     const count = get(data, 'count');
//
//     const defaults = makeArray(get(data, 'default'));
//     defaults.unshift(key);
//
//     const localeObj = new Locale(fallbackLocale, getOwner(this));
//     const template = localeObj.getCompiledTemplate(defaults, count);
//
//     return template(data);
// }

export default function missingMessage(key: string, locales: string|string[], _: object) {
    throw new Error(`[ember-intl] Missing translation for key: "${key}" for locales: "${locales}"`);
}
