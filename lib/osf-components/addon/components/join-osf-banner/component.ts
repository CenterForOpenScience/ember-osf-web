import Component from '@ember/component';
import { action } from '@ember/object';
import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'ember-osf-web/config/environment';
import Session from 'ember-simple-auth/services/session';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';

import Media from 'ember-responsive';
import styles from './styles';
import template from './template';

const {
    OSF: {
        localStorageKeys: {
            joinBannerDismissed: dismissedKey,
        },
    },
} = config;

@layout(template, styles)
export default class JoinOsfBanner extends Component {
    @service media!: Media;
    @service analytics!: Analytics;
    @service session!: Session;

    dismissed = false;
    storage = window.localStorage;
    previouslyDismissed = this.storage.getItem(dismissedKey) !== null;

    @or('session.isAuthenticated', 'previouslyDismissed')
    hideBanner!: boolean;

    @action
    dismiss() {
        this.set('dismissed', true);
        this.storage.setItem(dismissedKey, '0');
    }
}
