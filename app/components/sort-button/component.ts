import Component from '@ember/component';
import { computed } from '@ember/object';

export default class SortButton extends Component.extend({
    tagName: 'span',

    classNames: ['sort-group'],
}) {
    sortBy: string;

    sortByDesc = computed('sortBy', function(): string {
        return `-${this.get('sortBy')}`;
    });
}
