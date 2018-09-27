import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { Registry as Services } from '@ember/service';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Session from 'ember-simple-auth/services/session';

import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import param from 'ember-osf-web/utils/param';
import pathJoin from 'ember-osf-web/utils/path-join';

import layout from './template';

const { OSF: { url: baseUrl }, featureFlagNames } = config;

/**
 * Display the login dropdown on the navbar
 *
 * @class osf-navbar/auth-dropdown
 */
@tagName('')
export default class NavbarAuthDropdown extends Component {
    layout = layout;

    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service session!: Session;
    @service features!: Features;
    @service router!: Services['router'];

    @alias('currentUser.user') user!: User;

    /**
     * The URL to redirect to after logout
     *
     * @property redirectUrl
     * @type {String}
     */
    redirectUrl?: string;

    profileURL: string = defaultTo(this.profileURL, pathJoin(baseUrl, 'profile'));
    settingsURL: string = defaultTo(this.settingsURL, pathJoin(baseUrl, 'settings'));
    signUpURL: string = defaultTo(this.signUpURL, pathJoin(baseUrl, 'register'));

    @computed('router.currentURL')
    get signUpNext() {
        return pathJoin(baseUrl, this.router.currentURL);
    }

    @computed('signUpURL', 'signUpNext')
    get signUpRoute() {
        return this.features.isEnabled(featureFlagNames.routes.register) ? 'register' :
            `${this.signUpURL}?${param({ next: this.signUpNext })}`;
    }

    @computed('router.currentRouteName', 'signUpNext')
    get signUpQueryParams() {
        return this.router.currentRouteName === 'register' ? {} : { next: this.signUpNext };
    }

    @action
    login(this: NavbarAuthDropdown) {
        this.currentUser.login();
    }

    @action
    logout(this: NavbarAuthDropdown) {
        // Assuming `redirectUrl` comes back to this app, the session will be invalidated then.
        const query = this.redirectUrl ? `?${param({ next_url: this.redirectUrl })}` : '';
        window.location.href = `${config.OSF.url}logout/${query}`;
    }
}
