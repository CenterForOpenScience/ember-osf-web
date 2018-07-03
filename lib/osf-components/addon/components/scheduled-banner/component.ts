import { computed } from '@ember-decorators/object';
import { readOnly } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import Banner from 'ember-osf-web/models/banner';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import layout from './template';

export default class ScheduledBanners extends Component.extend({
    loadBanner: task(function *(this: ScheduledBanners) {
        const banner = yield this.store.findRecord('banner', 'current');
        return banner.name ? banner : null;
    }).on('init'),
}) {
    @service store!: DS.Store;
    @service analytics!: Analytics;

    layout = layout;
    styles = styles;

    @readOnly('loadBanner.last.value')
    banner?: Banner;

    @computed('banner.color')
    get bannerWrapperStyle() {
        if (!this.banner) {
            return null;
        }
        return htmlSafe(`background-color: ${this.banner.color};`);
    }
}
