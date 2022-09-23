import ApplicationInstance from '@ember/application/instance';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import Ember from 'ember';
import Features from 'ember-feature-flags/services/features';

import { Blocker } from 'ember-osf-web/services/ready';
import transitionTargetURL from 'ember-osf-web/utils/transition-target-url';

import config from 'ember-get-config';

const {
    featureFlagNames: {
        routes: routeFlags,
    },
} = config;

export function initialize(appInstance: ApplicationInstance): void {
    const routerService = appInstance.lookup('service:router') as RouterService;
    const currentUser = appInstance.lookup('service:current-user');
    const features = appInstance.lookup('service:features') as Features;
    const statusMessages = appInstance.lookup('service:status-messages');
    const ready = appInstance.lookup('service:ready');

    // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
    let readyBlocker = null as Blocker | null;

    routerService.on('routeWillChange', (transition: Transition) => {
        if (!readyBlocker || readyBlocker.isDone()) {
            readyBlocker = ready.getBlocker();
        }

        const isInitialTransition = transition.sequence === 0;
        if (!isInitialTransition) {
            const flag = routeFlags[transition.targetName];
            if (flag && !features.isEnabled(flag)) {
                if (!Ember.testing) {
                    try {
                        window.location.assign(transitionTargetURL(transition));
                    } catch (e) {
                        window.location.reload();
                    }
                }
                transition.abort();
            }
        }

        routerService._super(transition);
    });

    routerService.on('routeDidChange', (transition: Transition) => {
        currentUser.checkShowTosConsentBanner();
        statusMessages.updateMessages();
        if (!transition.queryParamsOnly) {
            const { rootElement: rootElementSelector } = appInstance as any;
            const rootElement = document.querySelector(rootElementSelector);
            rootElement.scrollIntoView();
        }

        if (readyBlocker && !readyBlocker.isDone()) {
            readyBlocker.done();
        }
    });
}

export default {
    initialize,
};
