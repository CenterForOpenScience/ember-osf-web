import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

import { Blocker } from 'ember-osf-web/services/ready';
import transitionTargetURL from 'ember-osf-web/utils/transition-target-url';

const {
    engines: {
        collections,
        handbook,
        registries,
    },
    featureFlagNames: {
        routes: routeFlags,
    },
} = config;

const Router = EmberRouter.extend({
    currentUser: service('current-user'),
    features: service('features'),
    statusMessages: service('status-messages'),
    ready: service('ready'),

    readyBlocker: null as Blocker | null,
    location: config.locationType,
    rootURL: config.rootURL,
    shouldScrollTop: true,

    willTransition(oldInfo: any, newInfo: any, transition: { targetName: string }) {
        if (!this.readyBlocker || this.readyBlocker.isDone()) {
            this.readyBlocker = this.get('ready').getBlocker();
        }

        this._super(oldInfo, newInfo, transition);
    },

    didTransition(...args: any[]) {
        this._super(...args);

        this.get('currentUser').checkShowTosConsentBanner();
        this.get('statusMessages').updateMessages();

        if (this.shouldScrollTop) {
            window.scrollTo(0, 0);
        }

        if (this.readyBlocker && !this.readyBlocker.isDone()) {
            this.readyBlocker.done();
        }
    },

    _doTransition(routeName: string, ...args: any[]) {
        const transition = this._super(routeName, ...args);

        // Don't snap the page to the top if it's just a query param change
        // IE registries, preprints, collections, etc
        // There doesn't appear to be a good way to access the transition
        // inside of didTransition, so the state is just plucked here for future reference.
        this.shouldScrollTop = !transition.queryParamsOnly;

        const flag = routeFlags[transition.targetName];
        if (flag && !this.get('features').isEnabled(flag)) {
            try {
                window.location.assign(transitionTargetURL(transition));
            } catch (e) {
                window.location.reload();
            }
            transition.abort();
        }
        return transition;
    },
});

/* eslint-disable array-callback-return */

Router.map(function() {
    this.mount('osf', { path: '/' });

    if (collections.enabled) {
        this.mount('collections');
    }

    if (handbook.enabled) {
        this.mount('handbook');
    }

    if (registries.enabled) {
        this.mount('registries');
    }

    // Error routes
    this.route('error-no-api', { path: '*no_api_path' });
    this.route('not-found', { path: '*path' });
});

/* eslint-enable array-callback-return */

export default Router;
