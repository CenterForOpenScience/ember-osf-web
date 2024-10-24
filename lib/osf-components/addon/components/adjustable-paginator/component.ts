import { classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { gt } from '@ember/object/computed';
import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('span')
@classNames('sort-group')
export default class AdjustablePaginator extends Component {
    // Optional arguments
    page?: number;
    maxPage?: number;
    totalCount?: number; // Total number of items
    previousPage?: () => unknown;
    nextPage?: () => unknown;
    selectedPageSize = 10;

    // Default page size options
    defaultPageSizeOptions = [10, 25, 50, 100];

    // Compute dynamic pageSizeOptions based on totalCount
    @computed('totalCount')
    get pageSizeOptions(): number[] {
        if (this.totalCount) {
            // Filter options smaller or equal to totalCount and include the next higher option
            const filteredOptions = this.defaultPageSizeOptions.filter(option => option <= this.totalCount);

            // Find the first option greater than totalCount and include it as well
            const nextHigherOption = this.defaultPageSizeOptions.find(option => option > this.totalCount);

            if (nextHigherOption) {
                filteredOptions.push(nextHigherOption); // Include the next higher option
            }

            return filteredOptions;
        }

        return this.defaultPageSizeOptions; // Return default options if totalCount is undefined or 0
    }

    // Check if the next page exists
    @computed('page', 'maxPage')
    get hasNext(): boolean {
        return Boolean(this.page && this.maxPage && this.page < this.maxPage);
    }
    @computed('page')
    get prevPage(): number {
        return this.page - 1;
    }

    @computed('page')
    get nextPage2(): number {
        return this.page + 1;
    }

    @computed('maxPage')
    get finalPage(): number {
        return this.maxPage + 1;
    }

    // Check if the previous page exists
    @gt('page', 1) hasPrev!: boolean;

    // Check if there are multiple pages
    @gt('maxPage', 1) hasMultiplePages!: boolean;

    // Action to go to the previous page
    @action
    _previous() {
        if (this.previousPage) {
            this.previousPage();
        }
    }

    // Action to go to the next page
    @action
    _next() {
        if (this.nextPage) {
            this.nextPage();
        }
    }

    // Action to handle page size changes
    @action
    onPageSizeChange(value: int) {
        this.set('pageSize', value);
        if (this.doReload) {
            this.doReload();
        }
    }

    @action
    setPage(page: number) {
        if (this.doReload) {
            this.doReload(page);
        }
    }
}
