import { layout } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import Analytics from 'ember-osf-web/services/analytics';
import Session from 'ember-simple-auth/services/session';
import styles from './styles';
import template from './template';

const {
    OSF: {
        localStorageKeys: {
            joinBannerDismissed: dismissedKey,
        },
    },
} = config;

@layout(template)
export default class JoinOsfBanner extends Component {
    styles = styles;

    @service analytics!: Analytics;
    @service session!: Session;

    dismissed: boolean = false;
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
