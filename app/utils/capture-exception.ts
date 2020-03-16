
// Raven is defined only in prod builds
declare const Raven: undefined | {
    captureException(e: Error, extra: object): void;
};

interface OsfApiError extends Error {
    errors?: Array<{ detail?: string }>;
}

// send exception info to sentry, if it's hooked up
export default function captureException(error: OsfApiError, extras = {}) {
    let errorMessage;
    if (Array.isArray(error.errors) && error.errors.length &&
        typeof error.errors[0].detail === 'string') {
        errorMessage = error.errors[0].detail;
    }
    const extra = { ...extras, ...(errorMessage ? { errorMessage } : {}) };

    if (Raven) {
        Raven.captureException(error, { extra });
    } else {
        // eslint-disable-next-line no-console
        console.error(error); // tslint:disable-line no-console
    }
}
