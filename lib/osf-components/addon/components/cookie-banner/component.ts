import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Cookies from 'ember-cookies/services/cookies';
import config from 'ember-osf-web/config/environment';
import Session from 'ember-simple-auth/services/session';
import moment from 'moment-timezone';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

const {
    OSF: {
        cookies: {
            cookieConsent: consentCookie,
        },
    },
} = config;

@layout(template, styles)
export default class CookieBanner extends Component {
    @service cookies!: Cookies;
    @service session!: Session;

    showBanner = !this.session.isAuthenticated && !this.cookies.exists(consentCookie);

    @action
    accept() {
        this.cookies.write(consentCookie, 1, {
            expires: moment().add(10, 'years').toDate(),
            path: '/',
        });
        this.set('showBanner', false);
    }
}
