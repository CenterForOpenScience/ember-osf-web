import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

import { layout } from 'ember-osf-web/decorators/component';
import File from 'ember-osf-web/models/file';
import Analytics from 'ember-osf-web/services/analytics';
import { FilesManager } from 'osf-components/components/files/manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class FileBrowserItem extends Component {
    @service analytics!: Analytics;

    filesManager!: FilesManager;

    item!: File;

    didReceiveAttrs() {
        assert('Files::Item requires @filesManager!', Boolean(this.filesManager));
    }

    @computed('item', 'filesManager.{currentFolder,inRootFolder}')
    get isCurrentFolder(): boolean {
        if (this.filesManager.inRootFolder) {
            return false;
        }

        return this.item.id === this.filesManager.currentFolder.id;
    }

    @computed('isCurrentFolder', 'filesManager.currentFolder')
    get shouldIndent() {
        return !this.filesManager.inRootFolder && !this.isCurrentFolder;
    }

    @computed('item.dateModified')
    get date(): string {
        return this.item ? moment(this.item.dateModified).format('YYYY-MM-DD hh:mm A') : '';
    }

    @action
    onClick() {
        if (this.item.isFolder) {
            if (this.isCurrentFolder) {
                this.analytics.trackFromElement(this.element, {
                    name: 'Go to parent folder',
                    category: 'button',
                    action: 'click',
                });

                this.filesManager.goToParentFolder(this.item);
            } else {
                this.analytics.trackFromElement(this.element, {
                    name: 'Open folder',
                    category: 'button',
                    action: 'click',
                });
                this.filesManager.goToFolder(this.item);
            }
        } else if (this.filesManager.onSelectFile) {
            this.filesManager.onSelectFile(this.item);
        }
    }

    @action
    onKeyPress(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.onClick();
        }
    }
}
