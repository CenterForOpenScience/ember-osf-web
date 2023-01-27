import Store from '@ember-data/store';
import { assert } from '@ember/debug';
import { action, notifyPropertyChange } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { BufferedChangeset } from 'ember-changeset/types';
import { restartableTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import NodeModel from 'ember-osf-web/models/node';
import CustomItemMetadataRecordModel from 'ember-osf-web/models/custom-item-metadata-record';
import { resourceTypeGeneralOptions } from 'ember-osf-web/models/custom-metadata';
import { Permission } from 'ember-osf-web/models/osf-model';
import { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { languageCodes, LanguageCode } from 'ember-osf-web/utils/languages';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { tracked } from '@glimmer/tracking';

import { languageFromLanguageCode } from 'osf-components/components/file-metadata-manager/component';

interface Args {
    node: (NodeModel);
}

export interface NodeMetadataManager {
    edit: () => void;
    save: () => void;
    cancel: () => void;
    metadata: CustomItemMetadataRecordModel;
    node: (NodeModel);
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
    node: (NodeModel) = this.args.node;
    @tracked changeset!: BufferedChangeset;
    @tracked nodeChangeset!: BufferedChangeset;
    @or(
        'isEditingDescription',
        'isEditingFunding',
        'isEditingResources',
    ) inEditMode!: boolean;
    @tracked isEditingDescription = false;
    @tracked isEditingFunding = false;
    @tracked isEditingResources = false;
    @tracked userCanEdit!: boolean;
    @or(
        'getGuidMetadata.isRunning',
        'cancelMetadata.isRunning',
        'cancelNode.isRunning',
    ) isGatheringData!: boolean;
    @or('saveNode.isRunning', 'saveMetadata.isRunning') isSaving!: boolean;
    @alias('changeset.isDirty') isDirty!: boolean;
    @alias('node.id') nodeId!: string;
    @tracked guidType!: string | undefined;
    resourceTypeGeneralOptions: string[] = resourceTypeGeneralOptions;
    languageCodes: LanguageCode[] = languageCodes;
    saveErrored = false;
    saveNodeErrored = false;

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
            this.metadata = await guidRecord.customMetadata as CustomItemMetadataRecordModel;
            notifyPropertyChange(this, 'metadata');
            this.changeset = buildChangeset(this.metadata, null);
            this.changeset.languageObject = {
                code: this.metadata.language,
                name: this.languageFromCode,
            };
            this.changeset.execute();
            this.nodeChangeset = buildChangeset(this.node, null);
        }
    }

    get languageFromCode(){
        const languageCode = this.metadata?.language || '';
        return languageFromLanguageCode(languageCode);
    }

    @action
    editDescription(){
        this.isEditingDescription = true;
    }

    @action
    editResources(){
        this.isEditingResources = true;
    }

    @action
    editFunding(){
        this.isEditingFunding = true;
    }

    @task
    @waitFor
    async cancelMetadata(){
        if (this.saveErrored) {
            await this.metadata.reload();
            this.metadata.rollbackAttributes();
            this.saveErrored = false;
        }
        this.changeset.rollback();
        this.changeset.languageObject = {
            code: this.metadata.language,
            name: this.languageFromCode,
        };
        this.changeset.execute();
        this.isEditingFunding = false;
        this.isEditingResources = false;
    }

    @task
    @waitFor
    async cancelNode(){
        if (this.saveNodeErrored){
            await this.node.reload();
            this.saveNodeErrored = false;
        }
        this.nodeChangeset.rollback();
        this.isEditingDescription = false;
    }

    @action
    changeLanguage(selected: LanguageCode) {
        const language = selected ? selected.code : '';
        this.changeset.set('language', language);
    }

    @restartableTask
    @waitFor
    async saveMetadata(){
        try {
            await this.changeset.save();
            this.isEditingFunding = false;
            this.isEditingResources = false;
            this.saveErrored = false;
        } catch (e) {
            this.saveErrored = true;
            const errorTitle = this.intl.t('osf-components.item-metadata-manager.error-saving-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }

    @restartableTask
    @waitFor
    async saveNode(){
        try {
            await this.nodeChangeset.save();
            this.isEditingDescription = false;
            this.saveNodeErrored = false;
        } catch (e) {
            this.saveNodeErrored = true;
            const errorTitle = this.intl.t('osf-components.item-metadata-manager.error-saving-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }
}
