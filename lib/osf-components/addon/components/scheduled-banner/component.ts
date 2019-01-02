import { computed } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import Banner from 'ember-osf-web/models/banner';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ScheduledBanners extends Component.extend({
    loadBanner: task(function *(this: ScheduledBanners) {
        const banner = yield this.store.findRecord('banner', 'current');
        return banner.name ? banner : null;
    }).on('init'),
}) {
    @service store!: DS.Store;
    @service analytics!: Analytics;

    @reads('loadBanner.last.value')
    banner?: Banner;

    @computed('banner.color')
    get bannerWrapperStyle() {
        if (!this.banner) {
            return null;
        }
        return htmlSafe(`background-color: ${this.banner.color};`);
    }
}
