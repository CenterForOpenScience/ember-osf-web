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
export default class SimplePaginator extends Component {
    // Optional arguments (omitting will display a placeholder)
    curPage?: number;
    maxPage?: number;
    previousPage?: () => unknown;
    nextPage?: () => unknown;

    @computed('curPage', 'maxPage')
    get hasNext(): boolean {
        return Boolean(this.curPage && this.maxPage && this.curPage < this.maxPage);
    }

    @gt('curPage', 1) hasPrev!: boolean;
    @gt('maxPage', 1) hasMultiplePages!: boolean;

    @action
    _previous() {
        if (this.previousPage) {
            this.previousPage();
        }
    }

    @action
    _next() {
        if (this.nextPage) {
            this.nextPage();
        }
    }
}
