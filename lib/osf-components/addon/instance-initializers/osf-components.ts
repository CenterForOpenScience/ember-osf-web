import ApplicationInstance from '@ember/application/instance';

import en from 'osf-components/locales/en/translations';
import ja from 'osf-components/locales/ja/translations';
import zh from 'osf-components/locales/zh/translations';

/**
 * Automatically expose translations for addon in a way that can be merged in with app.
 * @see https://github.com/jamesarosen/ember-i18n/issues/255
 */
export function initialize(appInstance: ApplicationInstance): void {
    const i18n = appInstance.lookup('service:i18n');
    i18n.addTranslations('en', en);
    i18n.addTranslations('ja', ja);
    i18n.addTranslations('zh', zh);
}

export default {
    initialize,
};
