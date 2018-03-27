import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default class SortButton extends Component.extend({
    tagName: 'span',

    classNames: ['sort-group'],
}) {
    sortBy: string;
    @service analytics;

    sortByDesc = computed('sortBy', function(): string {
        return `-${this.get('sortBy')}`;
    });
}
