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

import CustomItemMetadataRecordModel from 'ember-osf-web/models/custom-item-metadata-record';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import RegistrationModel from 'ember-osf-web/models/registration';
import { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

interface Args {
    guid: string;
}

export interface ItemMetadataManager {
    edit: () => void;
    save: () => void;
    cancel: () => void;
    metadata: CustomItemMetadataRecordModel;
    node: (NodeModel | RegistrationModel);
    changeset: BufferedChangeset;
    inEditMode: boolean;
    isSaving: boolean;
    userCanEdit: boolean;
    isDirty: boolean;
    isGatheringData: boolean;
}

export default class ItemMetadataManagerComponent extends Component<Args> {
    @service store!: Store;
    @service intl!: Intl;
    @service toast!: Toast;

    metadata!: CustomItemMetadataRecordModel;
    node!: (NodeModel | RegistrationModel);
    changeset!: BufferedChangeset;
    inEditMode = false;
    userCanEdit!: boolean;
    @or(
        'getGuidMetadata.isRunning',
        'getNode.isRunning',
    )
    isGatheringData!: boolean;
    @alias('changeset.isDirty') isDirty!: boolean;
    @alias('save.isRunning') isSaving!: boolean;
    guidType!: string | undefined;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert(
            'You will need pass in a node or registration @guid to the ItemMetadataManager component to get metadata',
            Boolean(args.guid),
        );
        try {
            taskFor(this.getGuidMetadata).perform();
            taskFor(this.getNode).perform();
            this.userCanEdit = this.node.currentUserPermissions.includes(Permission.Write);
            this.changeset = buildChangeset(this.metadata, null);
        } catch (e) {
            const errorTitle = this.intl.t('osf-components.item-metadata-manager.error-getting-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }

    @task
    @waitFor
    async getGuidMetadata() {
        if (this.args.guid) {
            const guidRecord = await this.store.findRecord('guid', this.args.guid, {
                include: 'metadata',
                resolve: false,
            });
            this.guidType = guidRecord.referentType;
            this.metadata = guidRecord.customMetadata as CustomItemMetadataRecordModel;
        }
    }

    @task
    @waitFor
    async getNode() {
        if (this.args.guid) {
            if (this.guidType === 'node') {
                this.node = await this.store.findRecord('node', this.args.guid);
            } else {
                this.node = await this.store.findRecord('registration', this.args.guid);
            }
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
            this.changeset.save();
            this.inEditMode = false;
        } catch (e) {
            const errorTitle = this.intl.t('osf-components.item-metadata-manager.error-saving-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }
}
