import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
    this.route('my-quickfiles', {path: '/quickfiles'});
    this.route('user-quickfiles', {path: '/:user_id/quickfiles'});
    this.route('file-detail', {path: '/:file_id'});
});

export default Router;
