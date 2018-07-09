import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { equal } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { serviceLinks } from 'ember-osf-web/const/service-links';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import Session from 'ember-simple-auth/services/session';
import layout from './template';

const discoverPageApps = [
    'collections',
    'registries',
    'preprints',
];

/**
 * Display default OSF navbar links
 *
 * @class osf-navbar/home-links
 */
@tagName('')
export default class OsfNavbarHomeLinks extends Component {
    layout = layout;

    @service session!: Session;
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service router!: any;

    onLinkClick: string = defaultTo(this.onLinkClick, 'onLinkClick');
    searchUrl = serviceLinks.search;
    donateUrl = 'https://cos.io/donate';
    myProjectsUrl = serviceLinks.myProjects;
    reviewsUrl = serviceLinks.reviewsHome;

    hostAppName: string = defaultTo(this.hostAppName, '');

    @computed('router.currentRouteName')
    get searchRoute(): string {
        const { currentRouteName } = this.router;
        const app = discoverPageApps.find(str => currentRouteName.startsWith(str));

        return app ? `${app}.discover` : '';
    }

    @equal('router.currentRouteName', 'institutions') onInstitutions!: boolean;
}
