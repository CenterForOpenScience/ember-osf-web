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

import AbstractNodeModel from 'ember-osf-web/models/abstract-node';
import CustomItemMetadataRecordModel from 'ember-osf-web/models/custom-item-metadata-record';
import { Permission } from 'ember-osf-web/models/osf-model';
import { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { languageCodes, LanguageCode } from 'ember-osf-web/utils/languages';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { tracked } from '@glimmer/tracking';

interface Args {
    node: (AbstractNodeModel);
}

export const resourceTypeGeneralOptions = [
    'Audiovisual',
    'Book',
    'BookChapter',
    'Collection',
    'ComputationalNotebook',
    'ConferencePaper',
    'ConferenceProceeding',
    'DataPaper',
    'Dataset',
    'Dissertation',
    'Event',
    'Image',
    'InteractiveResource',
    'Journal',
    'JournalArticle',
    'Model',
    'OutputManagementPlan',
    'PeerReview',
    'PhysicalObject',
    'Preprint',
    'Report',
    'Service',
    'Software',
    'Sound',
    'Standard',
    'Text',
    'Workflow',
    'Other',
];

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
    @or( 'getGuidMetadata.isRunning', 'cancel.isRunning') isGatheringData!: boolean;
    @alias('changeset.isDirty') isDirty!: boolean;
    @alias('save.isRunning') isSaving!: boolean;
    @tracked guidType!: string | undefined;
    resourceTypeGeneralOptions: string[] = resourceTypeGeneralOptions;
    languageCodes: LanguageCode[] = languageCodes;
    saveErrored = false;

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
        }
    }

    get languageFromCode(){
        if (this.metadata?.language){
            const languages = this.languageCodes.filter(item => item.code === this.metadata.language);
            const language = languages[0];
            if(language){
                return language.name;
            }
        }
        return '';
    }

    @action
    edit(){
        this.inEditMode = true;
    }

    @task
    @waitFor
    async cancel(){
        if (this.saveErrored){
            await this.metadata.reload();
            this.saveErrored = false;
        }
        this.changeset.rollback();
        this.changeset.languageObject = {
            code: this.metadata.language,
            name: this.languageFromCode,
        };
        this.changeset.execute();
        this.inEditMode = false;
    }

    @action
    changeLanguage(selected: LanguageCode){
        if(selected){
            this.changeset.set('language', selected.code);
        } else {
            this.changeset.set('language', '');
        }
    }

    @restartableTask
    @waitFor
    async save(){
        try {
            await this.changeset.save();
            this.inEditMode = false;
            this.saveErrored = false;
        } catch (e) {
            this.saveErrored = true;
            const errorTitle = this.intl.t('osf-components.item-metadata-manager.error-saving-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }
}
