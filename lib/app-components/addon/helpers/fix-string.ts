import Helper from '@ember/component/helper';
import fixSpecialChars from 'ember-osf-web/utils/fix-special-char';

export default class FixString extends Helper {
    compute([textToFix]: [string]): string {
        return fixSpecialChars(textToFix);
    }
}
