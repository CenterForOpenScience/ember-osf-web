import { action, computed } from '@ember-decorators/object';
import { equal } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import { osfServices } from 'ember-osf-web/const/service-links';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import Session from 'ember-simple-auth/services/session';

const HOME_APP = 'HOME';

/**
 * Display the OSF navbar
 *
 * @class osf-navbar
 */
export default class OsfNavbar extends Component {
    @service session!: Session;
    @service analytics!: Analytics;
    /**
     * Action run when the user clicks "Sign In"
     *
     * @property loginAction
     * @type {Action}
     */
    loginAction?: () => void;

    /**
     * The URL to use for signup
     * May be overridden, e.g. for special campaign pages
     *
     * @property signupUrl
     * @type {String}
     */
    signupUrl: string = defaultTo(this.signupUrl, `${config.OSF.url}register`);

    /**
     * The URL to redirect to after logout
     *
     * @property redirectUrl
     * @type {String}
     */
    redirectUrl: string = defaultTo(this.redirectUrl, '');

    // TODO: When used in other apps, update to expect these as arguments or from the config
    hostAppName: string = HOME_APP;
    linksComponent: string = 'osf-navbar/home-links';
    indexRoute: string = 'dashboard';
    showNavLinks: boolean = false;

    osfApps = osfServices;

    @equal('currentApp', HOME_APP) inHomeApp!: boolean;

    @computed('hostAppName')
    get currentApp(): string {
        return (this.hostAppName === 'Dummy App' ? HOME_APP : this.hostAppName).toUpperCase();
    }

    @action
    toggleSecondaryNavigation() {
        this.toggleProperty('showNavLinks');
    }

    @action
    onClickPrimaryDropdown(this: OsfNavbar) {
        this.set('showNavLinks', false);
        this.analytics.click('button', 'Navbar - Dropdown Arrow');
    }
}
