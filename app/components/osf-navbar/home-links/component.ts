import { tagName } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { serviceLinks } from 'ember-osf-web/const/service-links';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';

/**
 * Display default OSF navbar links
 *
 * @class osf-navbar/home-links
 */
@tagName('')
export default class OsfNavbarHomeLinks extends Component {
    @service session;
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;

    onLinkClick = defaultTo(this.onLinkClick, 'onLinkClick');
    searchUrl = serviceLinks.search;
    donateUrl = 'https://cos.io/donate';
    myProjectsUrl = serviceLinks.myProjects;
    reviewsUrl = serviceLinks.reviewsHome;
}
