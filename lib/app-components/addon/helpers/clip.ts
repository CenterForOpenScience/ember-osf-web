import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Helper from '@ember/component/helper';

export default class ClipHelper extends Helper {
    @service intl!: Intl;

    compute([text, length]: [string, number]/* , hash */) {
        if (text.length <= length) {
            return text;
        }

        return `${text.substring(0, length - 3)}${this.intl.t('general.ellipsis')}`;
    }
}
