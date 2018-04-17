import { classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@tagName('span')
@classNames('sort-group', 'SimplePaginator')
export default class SimplePaginator extends Component {
    hasPrev: boolean;
    hasNext: boolean;
    curPage: number;
}
