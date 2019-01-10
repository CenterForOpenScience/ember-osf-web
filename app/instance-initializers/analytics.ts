import ApplicationInstance from '@ember/application/instance';

import Analytics from 'ember-osf-web/services/analytics';

export async function initialize(appInstance: ApplicationInstance) {
    const analytics: Analytics = appInstance.lookup('service:analytics');

    // TODO better ApplicationInstance type
    const root = document.querySelector((appInstance as any).application.rootElement)!;
    root.addEventListener('click', analytics.handleClick.bind(analytics, root));
}

export default {
    initialize,
};
