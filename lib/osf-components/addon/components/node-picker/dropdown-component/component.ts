import Component from '@glimmer/component';

/**
 * The Dropdown Node Args
 */
interface DropdownNodeArgs {
    isLoading: boolean;
    hasMore: false;
    loadMore: () => void;
}

export default class NodePickerDropdownComponent extends Component<DropdownNodeArgs> {
    hasMore = this.args.hasMore || false;
}
