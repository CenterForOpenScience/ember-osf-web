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
    truncate?: number;
    total?: number;

    @alias('items.firstObject') firstItem?: T;

    @computed('items.[]', 'remainingCount', 'shownCount')
    get middleItems(): T[] {
        const lastIndex = this.remainingCount ? this.shownCount : this.shownCount - 1;
        return this.items.slice(1, lastIndex);
    }

    @computed('items.[]', 'remainingCount', 'shownCount')
    get lastItem(): T | undefined {
        return this.remainingCount ?
            undefined :
            this.items[this.shownCount - 1];
    }

    @computed('total', 'items.length')
    get totalCount() {
        return typeof this.total === 'undefined' ?
            this.items.length :
            this.total;
    }

    @computed('truncate', 'items.length')
    get shownCount() {
        return typeof this.truncate === 'undefined' ?
            this.items.length :
            Math.min(this.truncate, this.items.length);
    }

    @computed('totalCount', 'shownCount')
    get remainingCount() {
        return Math.max(0, this.totalCount - this.shownCount);
    }

    didReceiveAttrs() {
        assert(
            '@items is required',
            Boolean(this.items),
        );
        assert(
            '@truncate must be > 2',
            typeof this.truncate === 'undefined' || this.truncate > 2,
        );
        assert(
            '@items cannot be longer than @total',
            typeof this.total === 'undefined' || this.items.length <= this.total,
        );
    }
}
