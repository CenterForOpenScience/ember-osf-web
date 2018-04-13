import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { SessionService } from 'ember-simple-auth/addon/services/session';
import Analytics from '../../services/analytics';

export default class JoinOsfBanner extends Component.extend() {
    @service analytics: Analytics;
    @service session: SessionService;

    storage = window.localStorage;
    dismissedBanner = this.storage.getItem('slide') !== null;

    @action
    dismiss(this: JoinOsfBanner) {
        this.set('dismissedBanner', true);
        const storage = this.get('storage');
        storage.setItem('slide', '0');
    }

    @computed('session.isAuthenticated', 'dismissedBanner')
    get collapsed(this: JoinOsfBanner): string {
        const isAuthenticated = this.get('session').get('isAuthenticated');
        return this.dismissedBanner || isAuthenticated ? 'collapse' : 'expand';
    }
}
