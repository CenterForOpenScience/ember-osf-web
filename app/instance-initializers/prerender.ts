import ApplicationInstance from '@ember/application/instance';

export function initialize(appInstance: ApplicationInstance): void {
    const ready = appInstance.lookup('service:ready');
    ready.onReady(() => {
        window.prerenderReady = true;
    });
}

export default {
    initialize,
};
