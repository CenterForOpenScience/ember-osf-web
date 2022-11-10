import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { BufferedChangeset } from 'ember-changeset/types';
import { restartableTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import CustomFileMetadataRecordModel from 'ember-osf-web/models/custom-file-metadata-record';
import CustomItemMetadataRecordModel from 'ember-osf-web/models/custom-item-metadata-record';
import FileModel from 'ember-osf-web/models/file';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import RegistrationModel from 'ember-osf-web/models/registration';
import { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

interface Args {
    file: FileModel;
}

export interface FileMetadataManager {
    edit: () => void;
    save: () => void;
    cancel: () => void;
    metadata: CustomFileMetadataRecordModel;
    targetMetadata: CustomItemMetadataRecordModel;
    file: FileModel;
    target: (NodeModel | RegistrationModel | AbstractNodeModel);
    changeset: BufferedChangeset;
    inEditMode: boolean;
    isSaving: boolean;
    userCanEdit: boolean;
    isDirty: boolean;
    isGatheringData: boolean;
}

export default class FileMetadataManagerComponent extends Component<Args> {
    @service store!: Store;
    @service intl!: Intl;
    @service toast!: Toast;

    metadata!: CustomFileMetadataRecordModel;
    targetMetadata!: CustomItemMetadataRecordModel;
    file: FileModel = this.args.file;
    target!: (NodeModel | RegistrationModel | AbstractNodeModel);
    changeset!: BufferedChangeset;
    inEditMode = false;
    userCanEdit!: boolean;
    @or(
        'getGuidMetadata.isRunning',
        'getFile.isRunning',
        'getTargetMetadata.isRunning',
    )
    isGatheringData!: boolean;
    @alias('changeset.isDirty') isDirty!: boolean;
    @alias('save.isRunning') isSaving!: boolean;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert(
            'You will need pass in a file object to the FileMetadataManager component to get metadata',
            Boolean(args.file),
        );
        try {
            taskFor(this.getGuidMetadata).perform();
            this.target = this.file.target as AbstractNodeModel as NodeModel;
            this.userCanEdit = this.target.currentUserPermissions.includes(Permission.Write);
            taskFor(this.getTargetMetadata).perform();
            this.changeset = buildChangeset(this.metadata, null);
        } catch (e) {
            const errorTitle = this.intl.t('osf-components.file-metadata-manager.error-getting-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }

    @task
    @waitFor
    async getGuidMetadata() {
        if (this.file) {
            const guidRecord = await this.store.findRecord('guid', this.file.guid, {
                include: 'metadata',
                resolve: false,
            });
            this.metadata = guidRecord.customMetadata as CustomFileMetadataRecordModel;
        }
    }

    @task
    @waitFor
    async getTargetMetadata() {
        const guidRecord = await this.store.findRecord('guid', this.target.id, {
            include: 'metadata',
            resolve: false,
        });
        this.targetMetadata = guidRecord.customMetadata as CustomItemMetadataRecordModel;
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
            this.changeset.save();
            this.inEditMode = false;
        } catch (e) {
            const errorTitle = this.intl.t('osf-components.file-metadata-manager.error-saving-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }
}
