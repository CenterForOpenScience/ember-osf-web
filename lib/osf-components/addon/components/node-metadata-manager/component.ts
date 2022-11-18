import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { action, notifyPropertyChange } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { BufferedChangeset } from 'ember-changeset/types';
import { restartableTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import CustomItemMetadataRecordModel from 'ember-osf-web/models/custom-item-metadata-record';
import { Permission } from 'ember-osf-web/models/osf-model';
import { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { tracked } from '@glimmer/tracking';

interface Args {
    node: (AbstractNodeModel);
}

export interface NodeMetadataManager {
    edit: () => void;
    save: () => void;
    cancel: () => void;
    metadata: CustomItemMetadataRecordModel;
    node: (AbstractNodeModel);
    changeset: BufferedChangeset;
    inEditMode: boolean;
    isSaving: boolean;
    userCanEdit: boolean;
    isDirty: boolean;
    isGatheringData: boolean;
}

export default class NodeMetadataManagerComponent extends Component<Args> {
    @service store!: Store;
    @service intl!: Intl;
    @service toast!: Toast;

    @tracked metadata!: CustomItemMetadataRecordModel;
    node: (AbstractNodeModel) = this.args.node;
    @tracked changeset!: BufferedChangeset;
    @tracked inEditMode = false;
    @tracked userCanEdit!: boolean;
    @alias( 'getGuidMetadata.isRunning') isGatheringData!: boolean;
    @alias('changeset.isDirty') isDirty!: boolean;
    @alias('save.isRunning') isSaving!: boolean;
    @tracked guidType!: string | undefined;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert(
            'You will need pass in a node or registration object to the NodeMetadataManager component to get metadata',
            Boolean(args.node),
        );
        try {
            taskFor(this.getGuidMetadata).perform();
            this.userCanEdit = this.node.currentUserPermissions.includes(Permission.Write);
        } catch (e) {
            const errorTitle = this.intl.t('osf-components.item-metadata-manager.error-getting-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }

    @task
    @waitFor
    async getGuidMetadata() {
        if (this.node) {
            const guidRecord = await this.store.findRecord('guid', this.node.id, {
                include: 'custom_metadata',
                resolve: false,
            });
            this.guidType = guidRecord.referentType;
            this.metadata = guidRecord.customMetadata as CustomItemMetadataRecordModel;
            notifyPropertyChange(this, 'metadata');
            this.changeset = buildChangeset(this.metadata, null);
        }
    }

    @action
    edit(){
        this.inEditMode = true;
    }

    @action
    cancel(){
        this.changeset.rollback();
        this.inEditMode = false;
    }

    @restartableTask
    @waitFor
    async save(){
        try {
            this.changeset.execute();
            this.inEditMode = false;
        } catch (e) {
            const errorTitle = this.intl.t('osf-components.item-metadata-manager.error-saving-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }
}
