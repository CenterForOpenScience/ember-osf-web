import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import Analytics from 'ember-osf-web/services/analytics';

export default class GuidMetadata extends Controller {
    @service media!: Media;
    @service analytics!: Analytics;
    @service store!: Store;

    @action
    changeTab(activeId: number) {
        const tabName = activeId === 0 ? 'registrations' : 'drafts';
        this.analytics.click('tab', `Registrations tab - Change tab to: ${tabName}`);
    }

    get isMobile() {
        return this.media.isMobile;
    }
}
