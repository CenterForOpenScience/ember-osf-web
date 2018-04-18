import { classNames, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

@tagName('span')
@classNames('sort-group')
export default class SimplePaginator extends Component {
    maxPage: number;
    curPage: number;

    @computed('curPage')
    get hasPrev(this: SimplePaginator): boolean {
        return this.get('curPage') > 1;
    }
    @computed('curPage', 'maxPage')
    get hasNext(this: SimplePaginator): boolean {
        return this.get('curPage') < this.get('maxPage');
    }
}
