import BaseValidator from 'ember-cp-validations/validators/base';

interface Options {
    messageKey: string;
}

export default class Affirmation extends BaseValidator {
    validate(this: Affirmation, value: boolean, options: Options) {
        return !!value || this.createErrorMessage(options.messageKey, value);
    }
}
