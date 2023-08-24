import Store from '@ember-data/store';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';
import Banner from 'ember-osf-web/models/banner';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ScheduledBanners extends Component {
    @service media!: Media;
    @service store!: Store;
    @service analytics!: Analytics;

    @reads('loadBanner.last.value')
    banner?: Banner;

    get isMobile() {
        return this.media.isMobile;
    }

    @computed('banner.color')
    get bannerWrapperStyle() {
        if (!this.banner) {
            return null;
        }
        return htmlSafe(`background-color: ${this.banner.color};`);
    }

    @task({ on: 'init' })
    @waitFor
    async loadBanner() {
        const banner = await this.store.findRecord('banner', 'current');
        return banner.name ? banner : null;
    }
}
