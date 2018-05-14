import { classNames, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { gt } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('span')
@classNames('sort-group')
@localClassNames('SimplePaginator')
export default class SimplePaginator extends Component {
    maxPage: number = defaultTo(this.maxPage, 1);
    curPage: number = defaultTo(this.curPage, 1);

    @computed('curPage', 'maxPage')
    get hasNext(this: SimplePaginator): boolean {
        return this.get('curPage') < this.get('maxPage');
    }

    @gt('curPage', 1) hasPrev!: boolean;

    @gt('maxPage', 1) hasPages!: boolean;
}
