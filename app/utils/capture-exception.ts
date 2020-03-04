
// Raven is defined only in prod builds
declare const Raven: undefined | {
    captureException(e: Error): void;
};

// send exception info to sentry, if it's hooked up
export default function captureException(e: Error) {
    if (Raven) {
        Raven.captureException(e);
    } else {
        // eslint-disable-next-line no-console
        console.error(e); // tslint:disable-line no-console
    }
}
