import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { serviceLinks } from 'ember-osf-web/const/service-links';
import AnalyticsMixin from 'ember-osf-web/mixins/analytics';

/**
 * Display default OSF navbar links
 *
 * @class osf-navbar/home-links
 */
export default class OsfNavbarHomeLinks extends Component.extend(AnalyticsMixin, {
    tagName: '',
}) {
    session = service('session');
    currentUser = service('current-user');

    searchUrl = serviceLinks.search;
    donateUrl = 'https://cos.io/donate';
    myProjectsUrl = serviceLinks.myProjects;
    reviewsUrl = serviceLinks.reviewsHome;
}
