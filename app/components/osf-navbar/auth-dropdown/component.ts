import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import { serviceLinks } from 'ember-osf-web/const/service-links';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Session from 'ember-simple-auth/services/session';
import $ from 'jquery';

/**
 * Display the login dropdown on the navbar
 *
 * @class osf-navbar/auth-dropdown
 */
@tagName('')
export default class NavbarAuthDropdown extends Component {
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

    @computed('user.links.profile_image')
    get gravatarUrl(): string {
        if (!this.user || !this.user.get('links')) {
            return '';
        }
        const imgLink = this.user.get('links').profile_image;
        return imgLink ? `${imgLink}&s=25` : '';
    }

    logout = task(function* (this: NavbarAuthDropdown) {
        const query = this.redirectUrl ? `?${$.param({ next_url: this.redirectUrl })}` : '';
        yield this.session.invalidate();
        window.location.href = `${config.OSF.url}logout/${query}`;
    });

    @action
    clicked(category: string, label: string) {
        this.analytics.click(category, label);

        if (this.onLinkClicked) {
            this.onLinkClicked();
        }
    }
}
