import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { validateFormat } from 'ember-changeset-validations/validators';

const Protocols = {
    http: 'http:',
    https: 'https:',
};

interface Options {
    acceptedProtocols?: string[];
    translationArgs?: {
        description: string,
    };
}

export function validateHttpUrl(options?: Options) {
    return (key: string, newValue: string, _: any, __: any, ___: any) => {
        const acceptedProtocols = options?.acceptedProtocols || [Protocols.http, Protocols.https];
        const translationArgs = options?.translationArgs || { description: '' };

        let url;
        try {
            url = new URL(newValue);
        } catch (e) {
            return buildMessage(key, {
                type: 'url',
                context: {
                    type: 'url',
                    translationArgs,
                },
            });
        }

        if (acceptedProtocols.indexOf(url.protocol) === -1) {
            return buildMessage(key, {
                type: 'url',
                context: {
                    type: 'url',
                    translationArgs,
                },
            });
        }
        return validateFormat({
            allowBlank: false,
            type: 'url',
            translationArgs,
        })(key, newValue, _, __, ___);
    };
}
