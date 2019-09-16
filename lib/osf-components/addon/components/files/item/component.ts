import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
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

    @computed('item', 'filesManager.currentFolder')
    get isCurrentFolder(): boolean {
        if (!this.filesManager.currentFolder || !this.item) {
            return false;
        }

        return this.item.id === this.filesManager.currentFolder.id;
    }

    @computed('isCurrentFolder', 'manager.currentFolder')
    get shouldIndent() {
        return this.filesManager.currentFolder && !this.isCurrentFolder;
    }

    @computed('item.dateModified')
    get date(): string {
        return this.item ? moment(this.item.dateModified).format('YYYY-MM-DD hh:mm A') : '';
    }

    @action
    onClickFile(currentItem: File) {
        const isSelected = this.filesManager.selectedItems.includes(currentItem);

        this.analytics.trackFromElement(this.element, {
            name: `${isSelected ? 'Unselect file' : 'Select file'}`,
            category: 'button',
            action: 'click',
        });

        if (isSelected) {
            this.filesManager.unselectItem(currentItem);
        } else {
            this.filesManager.selectItem(currentItem);
        }
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
        } else {
            this.onClickFile(this.item);
        }
    }
}
