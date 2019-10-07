import BaseValidator from 'ember-cp-validations/validators/base';

interface Options {
    messageKey: string;
}

export default class Affirmation extends BaseValidator {
    validate(value: boolean, options: Options) {
        return !!value || this.createErrorMessage(options.messageKey, value);
    }
}
