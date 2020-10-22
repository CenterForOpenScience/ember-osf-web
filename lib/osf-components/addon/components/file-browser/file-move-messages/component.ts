import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import NodeStorageModel from 'ember-osf-web/models/node-storage';

import template from './template';

@layout(template)
export default class FileBrowserFileMoveMessages extends Component {
    project!: Node;

    @alias('project.public') isPublicProject!: boolean;
    @not('project.isRoot') isChildNode!: boolean;

    @computed('project.storage', 'isPublicProject')
    get shouldShowError(): boolean {
        return (this.project.belongsTo('storage').value() as NodeStorageModel).isOverStorageCap;
    }

    @computed('project.storage', 'isPublicProject')
    get shouldShowWarning() {
        return (this.project.belongsTo('storage').value() as NodeStorageModel).isApproachingStorageCap;
    }
}
