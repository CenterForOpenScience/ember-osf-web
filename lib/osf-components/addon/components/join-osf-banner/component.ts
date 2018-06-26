import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import Session from 'ember-simple-auth/services/session';
import styles from './styles';
import layout from './template';

export default class JoinOsfBanner extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service session!: Session;

    storage = window.localStorage;
    dismissedBanner = this.storage.getItem('slide') !== null;

    @action
    dismiss(this: JoinOsfBanner) {
        this.set('dismissedBanner', true);
        this.storage.setItem('slide', '0');
    }

    @computed('session.isAuthenticated', 'dismissedBanner')
    get collapsed(): string {
        return this.dismissedBanner || this.session.isAuthenticated ? 'collapse' : 'expand';
    }
}
