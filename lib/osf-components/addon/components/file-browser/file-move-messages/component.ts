import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, bool } from '@ember/object/computed';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import NodeStorageModel, { StorageStatus } from 'ember-osf-web/models/node-storage';

import template from './template';

@layout(template)
export default class FileBrowserFileMoveMessages extends Component {
    project!: Node;

    @alias('project.public') isPublicProject!: boolean;
    @bool('project.links.relationships.parent') isChildNode!: boolean;

    @computed('project.storage')
    get selectedStorageStatus() {
        if (this.project) {
            return (this.project.belongsTo('storage').value() as NodeStorageModel).storageLimitStatus;
        }
        return undefined;
    }

    @computed('selectedStorageStatus', 'isPublicProject')
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

    @computed('selectedStorageStatus', 'isPublicProject')
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
