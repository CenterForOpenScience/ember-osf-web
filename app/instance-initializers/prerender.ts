import ApplicationInstance from '@ember/application/instance';
import captureException from 'ember-osf-web/utils/capture-exception';

export async function initialize(appInstance: ApplicationInstance) {
    const ready = appInstance.lookup('service:ready');
    try {
        await ready.ready();
        window.prerenderReady = true;
    } catch (e) {
        captureException(e, { errorMessage: 'service:ready blocker errored' });
    }
}

export default {
    initialize,
};

declare global {
    interface Window {
        prerenderReady: boolean;
    }
}
