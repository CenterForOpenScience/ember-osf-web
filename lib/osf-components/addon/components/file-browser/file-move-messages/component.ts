import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, bool } from '@ember/object/computed';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import NodeStorageModel, { StorageStatus } from 'ember-osf-web/models/node-storage';

import template from './template';

@layout(template)
export default class FileBrowserFileMoveMessages extends Component {
    selected!: Node;

    @alias('selected.public') isPublicProject!: boolean;
    @bool('selected.links.relationships.parent') isChildNode!: boolean;

    @computed('selected.storage')
    get selectedStorageStatus() {
        if (this.selected) {
            return (this.selected.belongsTo('storage').value() as NodeStorageModel).storageLimitStatus;
        }
        return undefined;
    }

    @computed('selected.storage', 'selectedStorageStatus', 'isPublicProject')
    get shouldShowError(): boolean {
        if (this.selectedStorageStatus) {
            if (this.selectedStorageStatus === StorageStatus.DEFAULT) {
                return false;
            }
            if (this.selectedStorageStatus === StorageStatus.OVER_PUBLIC) {
                return true;
            }
            if ([StorageStatus.OVER_PRIVATE, StorageStatus.APPROACHING_PUBLIC].includes(this.selectedStorageStatus)) {
                if (!this.isPublicProject) {
                    return true;
                }
            }
        }
        return false;
    }

    @computed('selected.storage', 'selectedStorageStatus', 'isPublicProject')
    get shouldShowWarning() {
        if (this.selectedStorageStatus) {
            if (!this.isPublicProject && (this.selectedStorageStatus === StorageStatus.APPROACHING_PRIVATE)) {
                return true;
            }

            if (this.isPublicProject && (this.selectedStorageStatus === StorageStatus.APPROACHING_PUBLIC)) {
                return true;
            }
        }
        return false;
    }
}
