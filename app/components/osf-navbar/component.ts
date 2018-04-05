import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import { osfServices } from 'ember-osf-web/const/service-links';

const HOME_APP = 'HOME';

/**
 * Display the OSF navbar
 *
 * @class osf-navbar
 */
export default class OsfNavbar extends Component.extend() {
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

    // Private properties
    session = service('session');
    analytics = service();

    // TODO: When used in other apps, update to expect these as arguments or from the config
    hostAppName: string = HOME_APP;
    linksComponent: string = 'osf-navbar/home-links';
    indexRoute: string = 'dashboard';

    osfApps = osfServices;
    showSearch = false;

    inHomeApp = computed.equal('currentApp', HOME_APP);

    currentApp = computed('hostAppName', function(this: OsfNavbar): string {
        let appName = this.get('hostAppName');
        if (appName === 'Dummy App') {
            appName = HOME_APP;
        }
        return appName.toUpperCase();
    });

    @action
    toggleSearch() {
        this.toggleProperty('showSearch');
        this.send('closeSecondaryNavigation');
    }

    @action
    closeSecondaryNavigation() {
        $('.navbar-collapse').collapse('hide');
    }

    @action
    closeSearch() {
        this.set('showSearch', false);
    }

    @action
    closeSecondaryAndSearch() {
        this.send('closeSecondaryNavigation');
        this.send('closeSearch');
    }
}
