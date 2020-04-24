import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
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

    @not('filesManager.inRootFolder') notInRootFolder!: boolean;

    didReceiveAttrs() {
        assert('Files::Browse requires @filesManager!', Boolean(this.filesManager));
    }

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
}
