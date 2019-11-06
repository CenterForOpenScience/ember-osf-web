import { computed } from '@ember-decorators/object';
import { A } from '@ember/array';
import Component from '@ember/component';

import fade from 'ember-animated/transitions/fade';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import { FilesManager } from 'osf-components/components/files/manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class FileBrowser extends Component {
    filesManager!: FilesManager;

    transition = fade;
    sort: string = '';

    rules(context: { newItems: [File], oldItems: [File] }) {
        const { newItems: [newFolder], oldItems: [oldFolder] } = context;

        if (oldFolder) {
            if (!newFolder || oldFolder.materializedPath.includes(newFolder.materializedPath)) {
                return toRight;
            }
        }

        return toLeft;
    }

    @computed('filesManager.{hasMore,loadingFolderItems}')
    get shouldShowLoadMoreButton() {
        return this.filesManager.hasMore && !this.filesManager.loadingFolderItems;
    }

    @computed('filesManager.displayedItems.[]', 'sort')
    get sortedItems() {
        let sortedItems = this.filesManager.displayedItems || [];

        if (this.sort) {
            const regex = /^(-?)([-\w]+)/;
            const groups = regex.exec(this.sort)!;

            groups.shift();
            const [reverse, sortKey] = groups.slice(0, 2);

            sortedItems = A(sortedItems).sortBy(sortKey);

            if (reverse) {
                sortedItems = sortedItems.reverse();
            }
        }

        const folders = sortedItems.filterBy('kind', 'folder');

        return [...folders, ...sortedItems.filter(item => item.kind !== 'folder')];
    }
}
