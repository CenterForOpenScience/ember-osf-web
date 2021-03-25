import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
export default class PaginatedList extends Component {
    // Required arguments
    items?: unknown[];
    page!: number;
    pageSize!: number;
    @requiredAction next!: () => void;
    @requiredAction previous!: () => void;
    @requiredAction doReload!: () => void;

    // Optional arguments
    loading: boolean = false;
    errorShown: boolean = false;
    totalCount?: number;

    // Private properties
    @computed('totalCount', 'pageSize')
    get maxPage() {
        if (typeof this.totalCount === 'undefined') {
            return undefined;
        }
        return Math.ceil(this.totalCount / this.pageSize);
    }

    @computed('maxPage', 'page', 'pageSize', 'totalCount')
    get placeholderCount() {
        if (typeof this.maxPage === 'undefined' || typeof this.totalCount === 'undefined') {
            return this.pageSize / 2;
        }
        if (this.page < this.maxPage || !(this.totalCount % this.pageSize)) {
            return this.pageSize;
        }
        return this.totalCount % this.pageSize;
    }

    @computed('items.length', 'loading', 'placeholderCount')
    get paginatorShown(): boolean {
        return Boolean((this.items && this.items.length) || (this.loading && this.placeholderCount));
    }
}
