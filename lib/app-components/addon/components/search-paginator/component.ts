import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

interface Item {
    text: string|number;
    disabled?: boolean;
    action?: string;
}

@layout(template, styles)
export default class SearchPaginator extends Component {
    @service i18n!: I18N;

    current: number = defaultTo(this.current, 1);
    minimum: number = defaultTo(this.minimum, 1);
    maximum: number = defaultTo(this.maximum, 100);

    @computed('current', 'minimum', 'maximum', 'i18n.locale')
    get numbers(): Array<string|number> {
        const total = this.maximum - this.minimum;
        const numbers: Array<string|number> = [];

        // Less than 10 results
        if (total <= 10) {
            for (let i = this.minimum; i <= this.maximum; i++) {
                numbers.push(i);
            }

            return numbers;
        }

        const ellipsis = this.i18n.t('general.ellipsis');
        const minPlus5 = this.minimum + 5;

        // Close to the minimum
        if (this.current < minPlus5) {
            for (let i = this.minimum; i < Math.max(minPlus5, this.current + 3); i++) {
                numbers.push(i);
            }

            numbers.push(ellipsis);

            for (let i = this.maximum - 1; i <= this.maximum; i++) {
                numbers.push(i);
            }

            return numbers;
        }

        const maxMinus5 = this.maximum - 5;

        // Close to the maximum
        if (this.current >= maxMinus5) {
            for (let i = this.minimum; i < this.minimum + 2; i++) {
                numbers.push(i);
            }

            numbers.push(ellipsis);

            for (let i = Math.min(this.current - 2, maxMinus5); i <= this.maximum; i++) {
                numbers.push(i);
            }

            return numbers;
        }

        // Somewhere in the middle
        for (let i = this.current - 2; i <= this.current + 2; i++) {
            numbers.push(i);
        }

        const minPlus2 = this.minimum + 2;
        const maxMinus2 = this.maximum - 2;

        return [
            this.minimum,
            this.minimum + 1,
            minPlus2 === this.current - 3 ? minPlus2 : ellipsis,
            ...numbers,
            maxMinus2 === this.current + 3 ? maxMinus2 : ellipsis,
            this.maximum - 1,
            this.maximum,
        ];
    }

    @computed('numbers', 'current', 'minimum', 'maximum', 'i18n.locale')
    get items(): Item[] {
        return [
            {
                text: this.i18n.t('app_components.search_paginator.prev'),
                disabled: this.current === this.minimum,
                action: 'prevPage',
            },
            ...this.numbers.map(text => ({
                text,
                disabled: typeof text !== 'number',
            })),
            {
                text: this.i18n.t('app_components.search_paginator.next'),
                disabled: this.current === this.maximum,
                action: 'nextPage',
            },
        ];
    }

    /**
     * Placeholder for closure action: pageChanged
     */
    @requiredAction pageChanged!: (page: number) => void;

    @action
    setPage(this: SearchPaginator, page: number): void {
        this.pageChanged(page);
    }

    @action
    prevPage(this: SearchPaginator): void {
        this.setPage(this.current - 1);
    }

    @action
    nextPage(this: SearchPaginator): void {
        this.setPage(this.current + 1);
    }
}
