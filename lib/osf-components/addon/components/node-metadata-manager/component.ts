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
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { languageCodes, LanguageCode } from 'ember-osf-web/utils/languages';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { tracked } from '@glimmer/tracking';

import { languageFromLanguageCode } from 'osf-components/components/file-metadata-manager/component';
import InstitutionModel from 'ember-osf-web/models/institution';
import LicenseModel from 'ember-osf-web/models/license';
import IdentifierModel from 'ember-osf-web/models/identifier';
import CurrentUser from 'ember-osf-web/services/current-user';
import UserModel from 'ember-osf-web/models/user';

interface Args {
    node: (NodeModel);
}

export interface NodeMetadataManager {
    editDescription: () => void;
    editFunding: () => void;
    editInstitutions: () => void;
    editResources: () => void;
    saveMetadata: () => void;
    saveNode: () => void;
    saveInstitutions: () => void;
    cancelMetadata: () => void;
    cancelNode: () => void;
    cancelInstitutions: () => void;
    toggleInstitution: () => void;
    metadata: CustomItemMetadataRecordModel;
    node: (NodeModel);
    changeset: BufferedChangeset;
    inEditMode: boolean;
    isSaving: boolean;
    userCanEdit: boolean;
    isDirty: boolean;
    isGatheringData: boolean;
    license: LicenseModel;
    identifiers: IdentifierModel[];
    isEditingInstitutions: boolean;
    isSavingInstitutions: boolean;
    affiliatedList: InstitutionModel[];
    user: UserModel;
}

export default class NodeMetadataManagerComponent extends Component<Args> {
    @service store!: Store;
    @service intl!: Intl;
    @service toast!: Toast;
    @service currentUser!: CurrentUser;

    @tracked metadata!: CustomItemMetadataRecordModel;
    node: (NodeModel) = this.args.node;
    @tracked changeset!: BufferedChangeset;
    @tracked nodeChangeset!: BufferedChangeset;
    @or(
        'isEditingDescription',
        'isEditingFunding',
        'isEditingResources',
        'isEditingInstitutions',
    ) inEditMode!: boolean;
    @tracked isEditingDescription = false;
    @tracked isEditingFunding = false;
    @tracked isEditingResources = false;
    @tracked isEditingInstitutions = false;
    @tracked userCanEdit!: boolean;
    @or(
        'getGuidMetadata.isRunning',
        'cancelMetadata.isRunning',
        'cancelNode.isRunning',
    ) isGatheringData!: boolean;
    @or('saveNode.isRunning', 'saveMetadata.isRunning', 'isSavingInstitutions') isSaving!: boolean;
    @alias('changeset.isDirty') isDirty!: boolean;
    @alias('node.id') nodeId!: string;
    @tracked license!: LicenseModel;
    @tracked identifiers!: IdentifierModel[];
    @tracked guidType!: string | undefined;
    @tracked affiliatedList!: InstitutionModel[];
    @tracked currentAffiliatedList!: InstitutionModel[];
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
            const node = this.node as NodeModel;
            this.affiliatedList = await node.queryHasMany(
                'affiliatedInstitutions', {
                    pageSize: 100,
                },
            );
            this.currentAffiliatedList = [...this.affiliatedList];
            this.license = await node.license;
            this.identifiers = await node.queryHasMany('identifiers');
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

    @action
    editInstitutions(){
        this.isEditingInstitutions = true;
    }

    @action
    toggleInstitution(institution: InstitutionModel) {
        if (this.currentAffiliatedList.includes(institution)) {
            this.currentAffiliatedList.removeObject(institution);
        } else {
            this.currentAffiliatedList.pushObject(institution);
        }
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
    cancelInstitutions(){
        this.currentAffiliatedList = [...this.affiliatedList];
        this.isEditingInstitutions = false;
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
            if (e.errors[0].source.pointer === '/data/attributes/funders/award_uri') {
                this.toast.error(this.intl.t('osf-components.funding-metadata.api_uri_validation_error'));
            } else {
                const errorTitle = this.intl.t('osf-components.item-metadata-manager.error-saving-metadata');
                this.toast.error(getApiErrorMessage(e), errorTitle);
            }
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

    @restartableTask
    @waitFor
    async saveInstitutions() {
        try {
            await this.node.updateM2MRelationship('affiliatedInstitutions', this.currentAffiliatedList);
            await this.node.reload();
            this.affiliatedList = [...this.currentAffiliatedList];
            this.isEditingInstitutions = false;
        } catch (e) {
            const errorMessage = this.intl.t('registries.drafts.draft.metadata.save_institutions_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    }
}
