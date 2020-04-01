import { ErrorObject } from 'jsonapi-typescript';
import { ErrorDocument } from 'osf-api';

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

// send exception info to sentry, if it's hooked up
export default function captureException(error: ErrorDocument, extras: object = {}) {
    const apiError = getApiError(error);
    const extra = { ...extras, ...(apiError || {}) };

    if (Raven) {
        Raven.captureException(error, { extra });
    } else {
        // eslint-disable-next-line no-console
        console.error(error); // tslint:disable-line no-console
    }
}
