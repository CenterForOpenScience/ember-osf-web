import { classNames, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

@tagName('span')
@classNames('sort-group')
export default class SortButton extends Component {
    @service analytics;

    sortBy: string;

    @computed('sortBy')
    get sortByDesc(): string {
        return `-${this.sortBy}`;
    }
}
