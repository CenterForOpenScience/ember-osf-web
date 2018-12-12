import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { observer } from '@ember/object';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import { getTaxonomies, TaxonomyItem } from '../component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('li')
@localClassNames('taxonomy-item')
export default class TaxonomyListItem extends Component.extend({
    /**
     * Using an observer here because the expandedList changes may occur before the nested item exists 🐔/🥚
     */
    // eslint-disable-next-line ember/no-observers
    expandedChanged: observer('expanded', function(this: TaxonomyListItem) {
        this.fetchChildren();
    }),

    didInsertElement(this: TaxonomyListItem) {
        this.fetchChildren();
    },
}) {
    @service analytics!: Analytics;
    @service theme!: Theme;

    item: TaxonomyItem = this.item;
    activeFilter: string[] = this.activeFilter;
    expandedList: string[] = this.expandedList;
    getTaxonomies = getTaxonomies.drop();

    @alias('item.path')
    path!: string;

    @computed('activeFilter.[]', 'path')
    get checked(): boolean {
        return this.activeFilter.includes(this.path);
    }

    @computed('expandedList.[]', 'path')
    get expanded(): boolean {
        return this.expandedList.includes(this.path);
    }

    fetchChildren(this: TaxonomyListItem) {
        if (!this.expanded) {
            return;
        }

        const { childCount, children } = this.item;

        if (childCount !== children.length) {
            this.get('getTaxonomies').perform(this.item, this.theme.provider!);
        }
    }

    @action
    toggleExpand() {
        const {
            expanded,
            item: { text, path },
        } = this;

        this.analytics.track(
            'tree',
            expanded ? 'contract' : 'expand',
            `Discover - ${text}`,
        );

        const method = expanded ? 'removeObject' : 'pushObject';
        this.expandedList[method](path);
    }
}
