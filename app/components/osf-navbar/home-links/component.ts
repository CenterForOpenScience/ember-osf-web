import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { serviceLinks } from 'ember-osf-web/const/service-links';

/**
 * Display default OSF navbar links
 *
 * @class osf-navbar/home-links
 */
export default class OsfNavbarHomeLinks extends Component.extend({
    tagName: '',
}) {
    session = service('session');
    analytics = service();
    currentUser = service('current-user');

    searchUrl = serviceLinks.search;
    donateUrl = 'https://cos.io/donate';
    myProjectsUrl = serviceLinks.myProjects;
    reviewsUrl = serviceLinks.reviewsHome;
}
