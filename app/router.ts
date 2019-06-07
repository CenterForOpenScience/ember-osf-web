import { getOwner } from '@ember/application';
import Transition from '@ember/routing/-private/transition';
import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import config from 'ember-get-config';

import { Blocker } from 'ember-osf-web/services/ready';
import scrollTo from 'ember-osf-web/utils/scroll-to';
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

    // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
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
            scrollTo(getOwner(this), 0);
        }

        if (this.readyBlocker && !this.readyBlocker.isDone()) {
            this.readyBlocker.done();
        }
    },

    _doTransition(...args: any[]) {
        const transition = this._super(...args);
        return this._beforeTransition(transition);
    },

    _doURLTransition(...args: any[]) {
        const transition = this._super(...args);
        return this._beforeTransition(transition);
    },

    _beforeTransition(transition: Transition) {
        // Don't snap the page to the top if it's just a query param change
        // IE registries, preprints, collections, etc
        // There doesn't appear to be a good way to access the transition
        // inside of didTransition, so the state is just plucked here for future reference.
        this.shouldScrollTop = !transition.queryParamsOnly;

        const isInitialTransition = transition.sequence === 0;
        if (!isInitialTransition) {
            const flag = routeFlags[transition.targetName];
            if (flag && !this.get('features').isEnabled(flag)) {
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
        return transition;
    },
});

/* eslint-disable array-callback-return */

Router.map(function() {
    // All non-guid routes (except error routes) belong above "Guid Routing"
    this.route('home', { path: '/' });
    this.route('new-home');
    this.route('dashboard');
    this.route('goodbye');
    this.route('institutions');
    this.route('new-home');
    this.route('quickfiles');
    this.route('register');
    this.route('settings', function() {
        this.route('profile', function() {
            this.route('education');
            this.route('employment');
            this.route('name');
            this.route('social');
        });
        this.route('developer-apps', { path: '/applications' }, function() {
            this.route('edit', { path: '/:developer_app_id' });
            this.route('create');
        });
        this.route('account');
        this.route('tokens', function() {
            this.route('edit', { path: '/:token_id' });
            this.route('create');
        });
    });
    this.route('support');
    this.route('meetings', function() {
        this.route('detail', { path: '/:meeting_id' });
    });

    if (collections.enabled) {
        this.mount('collections');
    }

    if (handbook.enabled) {
        this.mount('handbook');
    }

    if (registries.enabled) {
        this.mount('registries', { path: '--registries' });
    }

    this.route('guid-file', { path: '--file/:guid' });

    this.route('guid-node', { path: '--node/:guid' }, function() {
        this.mount('analytics-page', { as: 'analytics' });
        this.route('forks');
        this.route('registrations');
    });

    this.route('guid-preprint', { path: '--preprint/:guid' });

    this.route('guid-registration', { path: '--registration/:guid' }, function() {
        this.mount('analytics-page', { as: 'analytics' });
        this.route('forks');
    });

    this.route('guid-user', { path: '--user/:guid' }, function() {
        this.route('quickfiles');
    });

    /*
     * Guid Routing
     *
     * Root guid URLs (e.g. "/mst3k/") will match the `resolve-guid` route, which
     * will ask the API what type of object the guid refers to, then transition
     * to the appropriate route based off the `routeMap` property.
     *
     * Routes that handle guid objects should prefix their routes with the type
     * it handles prefixed with `--` (e.g. "--user/:user_guid")
     * The GuidLocation implementation will remove URL segments prefixed with `--`
     * resulting in clean guid URLs while still respecting Ember's routing semantics.
     */
    this.route('resolve-guid', { path: ':guid' }, function() {
        this.route('subpath', { path: '*path' });
    });

    // Error routes
    this.route('error-no-api', { path: '*no_api_path' });
    this.route('not-found', { path: '*path' });
});

/* eslint-enable array-callback-return */

export default Router;
