import EmberRouter from '@ember/routing/router';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

const Router = EmberRouter.extend({
    session: service('session'),
    metrics: service('metrics'),

    location: config.locationType,
    rootURL: config.rootURL,

    didTransition() {
        this._super(...arguments);
        this._trackPage();
    },

    _trackPage() {
        scheduleOnce('afterRender', this, () => {
            const page = this.get('url');
            const title = this.getWithDefault('currentRouteName', 'unknown');
            const metrics = this.get('metrics');
            const {
                authenticated,
                isPublic,
                resource,
            } = config.metricsAdapters[0].dimensions;

            /*
              There's supposed to be a document describing how dimensions should be handled, but it doesn't exist yet.
              When it does, we'll replace out this comment with the link to that documentation. For now:
                  1) isPublic: Public, Private, or n/a (for pages that aren't covered by app permissions like the
                  dashboard;
                  2) authenticated: Logged in or Logged out
                  3) resource: the JSONAPI type (node, file, user, etc) or n/a
            */

            metrics.trackPage({
                [authenticated]: this.get('session.isAuthenticated') ? 'Logged in' : 'Logged out',
                [isPublic]: title === 'file-detail' ? 'Public' : 'n/a',
                page,
                [resource]: 'undefined',
                title,
            });
        });
    },
});

/* eslint-disable array-callback-return */

Router.map(function() {
    this.route('dashboard', { path: '/' });
    this.route('quickfiles', { path: '/quickfiles' });
    this.route('quickfiles', { path: '/me/quickfiles' });
    this.route('user-quickfiles', { path: '/:user_id/quickfiles' });
    this.route('file-detail', { path: '/:file_id' });
    this.route('support', { path: '/support' });
});

/* eslint-enable array-callback-return */

export default Router;
