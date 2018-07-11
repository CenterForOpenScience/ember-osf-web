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
import defaultTo from 'ember-osf-web/utils/default-to';
import Session from 'ember-simple-auth/services/session';
import $ from 'jquery';
import styles from './styles';
import layout from './template';

/**
 * Display the login dropdown on the navbar
 *
 * @class osf-navbar/auth-dropdown
 */
@tagName('')
export default class NavbarAuthDropdown extends Component {
    layout = layout;
    styles = styles;

    @service session!: Session;
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;

    /**
     * Action run when the user clicks "Sign In"
     */
    loginAction?: () => void;

    /**
     * Action run wheneven the user clicks a link
     */
    onLinkClicked?: () => void;

    /**
     * The URL to use for signup
     */
    signupUrl?: string;

    /**
     * The URL to redirect to after logout
     */
    redirectUrl?: string;

    serviceLinks = serviceLinks;

    externalLink: boolean = defaultTo(this.externalLink, false);

    @computed('external')
    get linkComponent() {
        return `link-to${this.externalLink ? '-external' : ''}`;
    }

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
