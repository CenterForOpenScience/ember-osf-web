import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import { serviceLinks } from 'ember-osf-web/const/service-links';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Session from 'ember-simple-auth/services/session';
import $ from 'jquery';
import layout from './template';

/**
 * Display the login dropdown on the navbar
 *
 * @class osf-navbar/auth-dropdown
 */
@tagName('')
export default class NavbarAuthDropdown extends Component {
    layout = layout;

    /**
     * Action run when the user clicks "Sign In"
     *
     * @property loginAction
     * @type {Action}
     */
    loginAction?: () => void;

    /**
     * Action run wheneven the user clicks a link
     *
     * @property loginAction
     * @type {Action}
     */
    onLinkClicked?: () => void;

    /**
     * The URL to use for signup
     *
     * @property signupUrl
     * @type {String}
     */
    signupUrl?: string;

    /**
     * The URL to redirect to after logout
     *
     * @property redirectUrl
     * @type {String}
     */
    redirectUrl?: string;

    // Private properties
    @service session!: Session;
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;

    serviceLinks = serviceLinks;

    @alias('currentUser.user') user!: User;

    @action
    logout(this: NavbarAuthDropdown) {
        // Assuming `redirectUrl` comes back to this app, the session will be invalidated then.
        const query = this.redirectUrl ? `?${$.param({ next_url: this.redirectUrl })}` : '';
        window.location.href = `${config.OSF.url}logout/${query}`;
    }

    @action
    clicked(category: string, label: string) {
        this.analytics.click(category, label);

        if (this.onLinkClicked) {
            this.onLinkClicked();
        }
    }
}
