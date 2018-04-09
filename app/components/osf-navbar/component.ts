import { action, computed } from '@ember-decorators/object';
import { equal } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import { osfServices } from 'ember-osf-web/const/service-links';

const HOME_APP = 'HOME';

/**
 * Display the OSF navbar
 *
 * @class osf-navbar
 */
export default class OsfNavbar extends Component {
    @service session;
    @service analytics;
    /**
     * Action run when the user clicks "Sign In"
     *
     * @property loginAction
     * @type {Action}
     */
    loginAction: () => void;

    /**
     * The URL to use for signup
     * May be overridden, e.g. for special campaign pages
     *
     * @property signupUrl
     * @type {String}
     */
    signupUrl: string = this.signupUrl || `${config.OSF.url}register`;

    /**
     * The URL to redirect to after logout
     *
     * @property redirectUrl
     * @type {String}
     */
    redirectUrl: string = this.redirectUrl || '';

    // TODO: When used in other apps, update to expect these as arguments or from the config
    hostAppName: string = HOME_APP;
    linksComponent: string = 'osf-navbar/home-links';
    indexRoute: string = 'dashboard';

    osfApps = osfServices;
    showSearch = false;

    @equal('currentApp', HOME_APP) inHomeApp;

    @computed('hostAppName')
    get currentApp(this: OsfNavbar): string {
        const appName = this.get('hostAppName');

        return (appName === 'Dummy App' ? HOME_APP : appName).toUpperCase();
    }

    @action
    closeSearch(this: OsfNavbar) {
        this.set('showSearch', false);
        this.send('closeSecondaryNavigation');
    }

    @action
    closeSecondaryNavigation(this: OsfNavbar) {
        $('.navbar-collapse').collapse('hide');
    }

    @action
    closeSecondaryAndSearch(this: OsfNavbar) {
        this.send('closeSecondaryNavigation');
        this.set('showSearch', false);
    }
}
