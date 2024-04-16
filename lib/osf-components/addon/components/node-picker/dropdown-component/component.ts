import Component from '@glimmer/component';

/**
 * The Dropdown Node Args
 */
interface DropdownNodeArgs {
    isLoading: boolean;
    hasMore: boolean;
    loadMore: () => void;
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class NodePickerDropdownComponent extends Component<DropdownNodeArgs> { }
