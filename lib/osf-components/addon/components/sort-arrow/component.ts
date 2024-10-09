import Component from '@glimmer/component';
import { action } from '@ember/object';

interface SortArrowArgs {
  sort: string;
  sortBy: string;
  sortAction: (sortField: string) => void;
}

export default class SortArrow extends Component<SortArrowArgs> {

    get isCurrentAscending() {
        return this.args.sort === this.args.sortBy;
    }

    get isCurrentDescending() {
        return this.args.sort === `-${this.args.sortBy}`;
    }

    get isSelected() {
        return this.isCurrentAscending || this.isCurrentDescending;
    }

    @action
    handleSort() {
        this.args.sortAction(this.args.sortBy);
    }
}

