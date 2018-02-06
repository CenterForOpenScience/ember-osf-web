import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL,
    metrics: service(),

    didTransition() {
        this._super(...arguments);
        this._trackPage();
    },

    _trackPage() {
        scheduleOnce('afterRender', this, () => {
            const page = this.get('url');
            const title = this.getWithDefault('currentRouteName', 'unknown');

            this.get('metrics').trackPage({ page, title });
        });
    },
});

/* eslint-disable array-callback-return */

Router.map(function() {
    this.route('quickfiles', { path: '/quickfiles' });
    this.route('quickfiles', { path: '/me/quickfiles' });
    this.route('user-quickfiles', { path: '/:user_id/quickfiles' });
    this.route('file-detail', { path: '/:file_id' });
});

/* eslint-enable array-callback-return */

export default Router;
