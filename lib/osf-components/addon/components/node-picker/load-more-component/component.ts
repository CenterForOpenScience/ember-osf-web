import Component from '@glimmer/component';

/**
 * The Load More Node Args
 */
interface LoadMoreNodeArgs {
    isLoading: boolean;
    hasMore: boolean;
    loadMore: () => void;
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class NodePickerLoadMoreComponent extends Component<LoadMoreNodeArgs> { }
