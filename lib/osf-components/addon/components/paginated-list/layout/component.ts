import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import requiredAction from 'ember-osf-web/decorators/required-action';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

export default class PaginatedList extends Component {
    // Required arguments
    items!: any[];
    page!: number;
    pageSize!: number;
    @requiredAction next!: () => void;
    @requiredAction previous!: () => void;
    @requiredAction onDeleteItem!: () => void;

    // Optional arguments
    loading: boolean = defaultTo(this.loading, false);
    errorShown: boolean = defaultTo(this.errorShown, false);
    totalCount?: number;

    // Private properties
    layout = layout;

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
            return undefined;
        }
        return this.page < this.maxPage ? this.pageSize : this.totalCount % this.pageSize;
    }
}
