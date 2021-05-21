import { ErrorObject } from 'jsonapi-typescript';
import { ErrorDocument } from 'osf-api';

import { SafeString } from '@ember/template/-private/handlebars';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

// Raven is defined only in prod builds
declare const Raven: undefined | {
    captureException(e: ErrorDocument | Error, extra: object): void,
};

// Errors from currentUser.authenticatedAJAX requests.
interface AjaxRequestError {
    responseJSON: {
        errors: ErrorObject[],
    };
}

function getErrors(error: ErrorDocument | AjaxRequestError): ErrorObject[] {
    return 'responseJSON' in error ? error.responseJSON.errors : error.errors;
}

export function getApiError(error: ErrorDocument): ErrorObject|undefined {
    let apiError;
    const errors: ErrorObject[] = getErrors(error);
    if (Array.isArray(errors) && errors.length
        && typeof errors[0].detail === 'string') {
        [apiError] = errors;
    }
    return apiError;
}

export function getApiErrorMessage(error: ErrorDocument): string {
    const apiError = getApiError(error);
    return (apiError && apiError.detail) ? apiError.detail : '';
}

export function getApiErrors(error: ErrorDocument): Record<string, ErrorObject> {
    const errors: ErrorObject[] = getErrors(error);
    if (Array.isArray(errors)) {
        return errors.reduce(
            (acc: Record<string, ErrorObject>, val: ErrorObject, index) => (
                { ...acc, [`api_error_${index}`]: val }
            ),
            {},
        );
    }
    return {};
}

// send exception info to sentry, if it's hooked up
/* eslint-disable consistent-return */
export default function captureException(
    error: Error | ErrorDocument,
    extras: { errorMessage?: string | SafeString } = {},
) {
    let apiErrors = {};
    if (!(error instanceof Error)) {
        apiErrors = getApiErrors(error);
        if (extras.errorMessage) {
            /* eslint-disable-next-line no-param-reassign */
            extras.errorMessage = stripHtmlTags(extras.errorMessage.toString());
        }
    }

    const extra = { ...extras, ...apiErrors };

    if (typeof Raven !== 'undefined') {
        return Raven.captureException(error, { extra });
    }

    console.error(error); // eslint-disable-line  no-console
}
/* eslint-enable consistent-return */
