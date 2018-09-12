import { service } from '@ember-decorators/service';
import Helper from '@ember/component/helper';
import I18N from 'ember-i18n/services/i18n';

export default class ClipHelper extends Helper {
    @service i18n!: I18N;

    compute(params: [string, number]/* , hash */) {
        const [text, length] = params;

        if (text.length <= length) {
            return text;
        }

        return `${text.substring(0, length - 3)}${this.i18n.t('general.ellipsis')}`;
    }
}
