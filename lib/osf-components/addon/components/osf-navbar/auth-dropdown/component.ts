import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import Session from 'ember-simple-auth/services/session';
import $ from 'jquery';
import layout from './template';

export class AuthBase extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service session!: Session;

    @alias('currentUser.user') user!: User;

    /**
     * The URL to redirect to after logout
     *
     * @property redirectUrl
     * @type {String}
     */
    redirectUrl?: string;

    profileURL: string = defaultTo(this.profileURL, `${config.OSF.url}profile/`);
    settingsURL: string = defaultTo(this.settingsURL, `${config.OSF.url}settings/`);
    signUpURL: string = defaultTo(this.signUpURL, `${config.OSF.url}register/`);

    @computed('signUpURL')
    get _signupURL() {
        return `${this.signUpURL}?${$.param({ next: window.location.href })}`;
    }

    @action
    login(this: NavbarAuthDropdown) {
        this.currentUser.login();
    }

    @action
    logout(this: NavbarAuthDropdown) {
        // Assuming `redirectUrl` comes back to this app, the session will be invalidated then.
        const query = this.redirectUrl ? `?${$.param({ next_url: this.redirectUrl })}` : '';
        window.location.href = `${config.OSF.url}logout/${query}`;
    }
}

/**
 * Display the login dropdown on the navbar
 *
 * @class osf-navbar/auth-dropdown
 */
@tagName('')
export default class NavbarAuthDropdown extends AuthBase {
    layout = layout;
}
