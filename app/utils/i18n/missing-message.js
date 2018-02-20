import { getOwner } from '@ember/application';
import { makeArray } from '@ember/array';
import { get } from '@ember/object';
import config from 'ember-get-config';
import Locale from 'ember-i18n/utils/locale';

const fallbackLocale = config.i18n.defaultLocale;

export default function(locale, key, data) {
    if (locale === fallbackLocale) {
        return `Missing translation: ${key}`;
    }
    // NOTE This relies on internal APIs and is brittle.
    // Emulating the internals of ember-i18n's translate method.

    const count = get(data, 'count');

    const defaults = makeArray(get(data, 'default'));
    defaults.unshift(key);

    const localeObj = new Locale(fallbackLocale, getOwner(this));
    const template = localeObj.getCompiledTemplate(defaults, count);

    return template(data);
}
