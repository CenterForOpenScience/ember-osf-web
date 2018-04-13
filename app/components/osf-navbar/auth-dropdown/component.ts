import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import { serviceLinks } from 'ember-osf-web/const/service-links';
import User from 'ember-osf-web/models/user';

/**
 * Display the login dropdown on the navbar
 *
 * @class osf-navbar/auth-dropdown
 */
export default class NavbarAuthDropdown extends Component.extend({
    tagName: 'li',
    classNames: ['dropdown', 'secondary-nav-dropdown'],
    classNameBindings: ['notAuthenticated:sign-in'],
}) {
    /**
     * Action run when the user clicks "Sign In"
     *
     * @property loginAction
     * @type {Action}
     */
    loginAction: () => void;

    /**
     * Action run when the auth dropdown opens
     *
     * @property dropdownOpened
     * @type {Action}
     */
    dropdownOpened: () => void;

    /**
     * The URL to use for signup
     *
     * @property signupUrl
     * @type {String}
     */
    signupUrl: string;

    /**
     * The URL to redirect to after logout
     *
     * @property redirectUrl
     * @type {String}
     */
    redirectUrl: string;

    // Private properties
    session = service('session');
    analytics = service();
    currentUser = service('current-user');
    i18n = service('i18n');

    serviceLinks = serviceLinks;

    user: User = computed.alias('currentUser.user');
    notAuthenticated: boolean = computed.not('session.isAuthenticated');
    gravatarUrl = computed('user.links.profile_image', function(this: NavbarAuthDropdown): string {
        const imgLink = this.get('user.links.profile_image');
        return imgLink ? `${imgLink}&s=25` : '';
    });

    logout = task(function* (this: NavbarAuthDropdown) {
        const redirectUrl = this.get('redirectUrl');
        const query = redirectUrl ? `?${Ember.$.param({ next_url: redirectUrl })}` : '';
        yield this.get('session').invalidate();
        window.location.href = `${config.OSF.url}logout/${query}`;
    });
}
