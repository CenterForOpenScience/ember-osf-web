import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@tagName('')
export default class InlineList<T> extends Component {
    // Required arguments
    items!: T[];

    // Optional arguments
    truncateCount?: number;
    total?: number;

    @alias('items.firstObject') firstItem?: T;

    @computed('items.[]', 'shownCount')
    get middleItems(): T[] {
        return this.items.slice(1, this.shownCount - 1);
    }

    @computed('items.[]', 'shownCount')
    get lastItem(): T | undefined {
        return this.shownCount <= this.items.length ?
            this.items[this.shownCount - 1] :
            undefined;
    }

    @computed('total', 'items.length')
    get totalCount() {
        return typeof this.total === 'undefined' ?
            this.items.length :
            this.total;
    }

    @computed('truncateCount', 'totalCount')
    get shownCount() {
        return typeof this.truncateCount === 'undefined' ?
            this.totalCount :
            Math.min(this.truncateCount, this.totalCount);
    }

    @computed('totalCount', 'shownCount')
    get remainingCount() {
        return Math.max(0, this.totalCount - this.shownCount);
    }

    didReceiveAttrs() {
        assert(
            '@truncateCount must be > 2',
            typeof this.truncateCount === 'undefined' || this.truncateCount > 2,
        );
    }
}
