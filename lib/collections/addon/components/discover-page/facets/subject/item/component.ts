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
import { getSubjects, SubjectItem } from '../component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('li')
@localClassNames('taxonomy-item')
export default class SubjectListItem extends Component.extend({
    /**
     * Using an observer here because the expandedList changes may occur before the nested item exists 🐔/🥚
     */
    // eslint-disable-next-line ember/no-observers
    expandedChanged: observer('expanded', function(this: SubjectListItem) {
        this.fetchChildren();
    }),

    didInsertElement(this: SubjectListItem) {
        this.fetchChildren();
    },
}) {
    @service analytics!: Analytics;
    @service theme!: Theme;

    item: SubjectItem = this.item;
    activeFilter: string[] = this.activeFilter;
    expandedList: string[] = this.expandedList;
    getSubjects = getSubjects.drop();

    @alias('item.text')
    text!: string;

    @computed('activeFilter.[]', 'text')
    get checked(): boolean {
        return this.activeFilter.includes(this.text);
    }

    @computed('expandedList.[]', 'text')
    get expanded(): boolean {
        return this.expandedList.includes(this.text);
    }

    fetchChildren(this: SubjectListItem) {
        if (!this.expanded) {
            return;
        }

        const { childrenCount, children } = this.item;

        if (childrenCount !== children.length) {
            this.get('getSubjects').perform(this.item, this.theme.provider!);
        }
    }

    @action
    toggleExpand() {
        const {
            expanded,
            item: { text },
        } = this;

        this.analytics.track(
            'tree',
            expanded ? 'contract' : 'expand',
            `Discover - ${text}`,
        );

        const method = expanded ? 'removeObject' : 'pushObject';
        this.expandedList[method](text);
    }
}
