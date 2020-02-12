import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

export default class ClipHelper extends Helper {
    @service intl!: Intl;

    compute([text, length]: [string, number]/* , hash */) {
        if (text.length <= length) {
            return text;
        }

        return `${text.substring(0, length - 3)}${this.intl.t('general.ellipsis')}`;
    }
}
