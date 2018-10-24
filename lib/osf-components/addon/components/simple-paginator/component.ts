import { classNames, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { gt } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import styles from './styles';
import layout from './template';

@tagName('span')
@classNames('sort-group')
export default class SimplePaginator extends Component {
    layout = layout;
    styles = styles;

    // Optional arguments (omitting will display a placeholder)
    curPage?: number;
    maxPage?: number;
    previousPage?: () => unknown;
    nextPage?: () => unknown;

    @computed('curPage', 'maxPage')
    get hasNext(this: SimplePaginator): boolean {
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
