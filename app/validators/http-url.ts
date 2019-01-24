import BaseValidator from 'ember-cp-validations/validators/base';
import { regularExpressions } from 'ember-validators/format';

export interface HttpUrlValidatorOptions {
    requireHttps: boolean;
}

const httpRegExes = {
    // http OR https
    http: /^https?:\/\/[a-zA-Z0-9]/,
    // https only
    https: /^https:\/\/[a-zA-Z0-9]/,
    // accept either for localhost or 127.0.0.1
    localhost: /^https?:\/\/(?:localhost|127\.0\.0\.1)(?:[/:?]|$)/,
};

export default class HttpUrlValidator extends BaseValidator {
    validate(value: string, options: HttpUrlValidatorOptions = { requireHttps: false }) {
        const httpRegEx = options.requireHttps ? httpRegExes.https : httpRegExes.http;
        return (
            (
                (httpRegEx.test(value) && regularExpressions.url.test(value))
                || httpRegExes.localhost.test(value)
            )
            || this.createErrorMessage(
                options.requireHttps ? 'https_url' : 'url',
                value,
            )
        );
    }
}
