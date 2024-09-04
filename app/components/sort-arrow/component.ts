import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface SortArrowArgs {
  sort: string;
  sortBy: string;
  sortAction: (sortField: string) => void;
}

export default class SortArrow extends Component<SortArrowArgs> {

  get sortBy() {
    return this.args.sortBy || 'user_name';
  }

  get isCurrentAscending() {
    return this.args.sort === this.args.sortBy;
  }

  get isCurrentDescending() {
    return this.args.sort === `-${this.sortBy}`;
  }

  get isSelected() {
    return this.isCurrentAscending || this.isCurrentDescending;
  }

  @action
  handleSort() {
    if (this.args.sortAction) {  // Make sure sortAction is a function
      this.args.sortAction(this.args.sortBy);
    }
  }
}

