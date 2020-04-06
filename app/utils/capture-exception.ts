import { ErrorObject } from 'jsonapi-typescript';
import { ErrorDocument } from 'osf-api';

import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

// Raven is defined only in prod builds
declare const Raven: undefined | {
    captureException(e: ErrorDocument | Error, extra: object): void;
};

export function getApiError(error: ErrorDocument): ErrorObject|undefined {
    let apiError;
    if (Array.isArray(error.errors) && error.errors.length &&
        typeof error.errors[0].detail === 'string') {
        [apiError] = error.errors;
    }
    return apiError;
}

export function getApiErrorMessage(error: ErrorDocument): string {
    const apiError = getApiError(error);
    return (apiError && apiError.detail) ? apiError.detail : '';
}

export function getApiErrors(error: ErrorDocument): Record<string, ErrorObject> {
    return error.errors.reduce(
        (acc: Record<string, ErrorObject>, val: ErrorObject, index) => (
            { ...acc, [`api_error_${index}`]: val }
        ),
        {},
    );
}

// send exception info to sentry, if it's hooked up
/* eslint-disable consistent-return */
export default function captureException(
    error: ErrorDocument,
    extras: { errorMessage?: string } = {},
) {
    const apiErrors = getApiErrors(error);
    if (extras.errorMessage) {
        /* eslint-disable-next-line no-param-reassign */
        extras.errorMessage = stripHtmlTags(extras.errorMessage.toString());
    }
    const extra = { ...extras, ...apiErrors };

    if (Raven) {
        return Raven.captureException(error, { extra });
    }

    // eslint-disable-next-line no-console
    console.error(error); // tslint:disable-line no-console
}
/* eslint-enable consistent-return */
