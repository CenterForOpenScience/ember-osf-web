import ApplicationInstance from '@ember/application/instance';

export async function initialize(appInstance: ApplicationInstance) {
    const ready = appInstance.lookup('service:ready');
    await ready.ready();
    window.prerenderReady = true;
}

export default {
    initialize,
};

declare global {
    interface Window {
        prerenderReady: boolean;
    }
}
