import { classNames, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('span')
@classNames('sort-group')
export default class SimplePaginator extends Component {
    maxPage: number = defaultTo(this.maxPage, 1);
    curPage: number = defaultTo(this.curPage, 1);

    @computed('curPage')
    get hasPrev(this: SimplePaginator): boolean {
        return this.get('curPage') > 1;
    }
    @computed('curPage', 'maxPage')
    get hasNext(this: SimplePaginator): boolean {
        return this.get('curPage') < this.get('maxPage');
    }

    @computed('maxPage')
    get hasPages(this: SimplePaginator): boolean {
        return this.get('maxPage') !== 1;
    }
}
