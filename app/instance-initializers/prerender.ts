import ApplicationInstance from '@ember/application/instance';

export function initialize(appInstance: ApplicationInstance): void {
    const ready = appInstance.lookup('service:ready');
    ready.ready().then(() => {
        window.prerenderReady = true;
    });
}

export default {
    initialize,
};
