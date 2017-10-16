import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL,
});

/* eslint-disable array-callback-return */

Router.map(function() {
    this.route('quickfiles', { path: '/quickfiles' });
    this.route('quickfiles', { path: '/me/quickfiles' });
    this.route('user-quickfiles', { path: '/:user_id/quickfiles' });
    this.route('file-detail', { path: '/:file_id' });
    this.route('institutions');
});

/* eslint-enable array-callback-return */

export default Router;
