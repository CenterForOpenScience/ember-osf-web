import { module, test } from 'qunit';

import captureException, { getApiErrorMessage, getApiErrors } from 'ember-osf-web/utils/capture-exception';
import { ErrorDocument } from 'osf-api';

const error1 = 'bad request';
const error2 = 'service unavailable';
const error3 = 'method not allowed';

const apiError: ErrorDocument = {
    errors: [
        { detail: error1, code: '400' },
        { detail: error2, code: '503' },
        { detail: error3, code: '405' },
    ],
    meta: { version: '2.20' },
};

module('Unit | Utility | capture-exception', () => {
    test('utils: getApiErrorMessage, getApiErrors work', assert => {
        assert.equal(getApiErrorMessage(apiError), error1, 'getApiErrorMessage returns first api error text');
        assert.propEqual(getApiErrors(apiError), {
            api_error_0: { detail: error1, code: '400' },
            api_error_1: { detail: error2, code: '503' },
            api_error_2: { detail: error3, code: '405' },
        }, 'getApiErrors reduces error list to an object');
    });

    test('captureException works', assert => {
        // @ts-ignore
        window.Raven = {
            captureException: (_: ErrorDocument, { extra }: { extra: object }) => extra,
        };
        let actual = captureException(apiError, { errorMessage: 'Failed to load subjects' });
        assert.propEqual(actual, {
            errorMessage: 'Failed to load subjects',
            api_error_0: { detail: error1, code: '400' },
            api_error_1: { detail: error2, code: '503' },
            api_error_2: { detail: error3, code: '405' },
        }, 'Raven.captureException is called with the right extra context');

        const apiErrorEmpty: ErrorDocument = {
            errors: [],
            meta: { version: '2.20' },
        };
        actual = captureException(apiErrorEmpty, { errorMessage: 'Failed to load subjects' });
        assert.propEqual(actual, {
            errorMessage: 'Failed to load subjects',
        }, 'captureException handles empty errors list correctly');

        actual = captureException(apiErrorEmpty, {
            errorMessage: 'There was a problem merging <strong>foo@bar.ai</strong> into your account.',
        });
        assert.propEqual(actual, {
            errorMessage: 'There was a problem merging foo@bar.ai into your account.',
        }, 'captureException cleans up translations passed in as extras.errorMessage');

        // @ts-ignore
        delete window.Raven;
    });
});
