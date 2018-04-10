import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import { serviceLinks } from 'ember-osf-web/const/service-links';

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
    loginAction: () => void;

    /**
     * Action run wheneven the user clicks a link
     *
     * @property loginAction
     * @type {Action}
     */
    onLinkClicked: () => void;

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
    @service session;
    @service analytics;
    @service currentUser;
    @service i18n;

    serviceLinks = serviceLinks;

    user = computed.alias('currentUser.user');

    gravatarUrl = computed('user.links.profile_image', function(this: NavbarAuthDropdown): string {
        const imgLink = this.get('user.links.profile_image');
        return imgLink ? `${imgLink}&s=25` : '';
    });

    logout = task(function* (this: NavbarAuthDropdown) {
        const redirectUrl = this.get('redirectUrl');
        const query = redirectUrl ? `?${$.param({ next_url: redirectUrl })}` : '';
        yield this.get('session').invalidate();
        window.location.href = `${config.OSF.url}logout/${query}`;
    });

    @action
    clicked(this: NavbarAuthDropdown, category: string, label: string) {
        this.get('analytics').click(category, label);

        const onLinkClicked = this.get('onLinkClicked');
        if (onLinkClicked) {
            onLinkClicked();
        }
    }
}
