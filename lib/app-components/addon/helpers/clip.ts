import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import I18N from 'ember-i18n/services/i18n';

export default class ClipHelper extends Helper {
    @service i18n!: I18N;

    compute([text, length]: [string, number]/* , hash */) {
        if (text.length <= length) {
            return text;
        }

        return `${text.substring(0, length - 3)}${this.i18n.t('general.ellipsis')}`;
    }
}
