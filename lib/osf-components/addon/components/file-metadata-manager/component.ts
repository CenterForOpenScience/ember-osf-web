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

import CustomFileMetadataRecordModel from 'ember-osf-web/models/custom-file-metadata-record';
import CustomItemMetadataRecordModel from 'ember-osf-web/models/custom-item-metadata-record';
import FileModel from 'ember-osf-web/models/file';
import { Permission } from 'ember-osf-web/models/osf-model';
import { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { tracked } from '@glimmer/tracking';
import NodeModel from 'ember-osf-web/models/node';
import RegistrationModel from 'ember-osf-web/models/registration';
import LicenseModel from 'ember-osf-web/models/license';
import InstitutionModel from 'ember-osf-web/models/institution';
import { LanguageCode, languageCodes } from 'ember-osf-web/utils/languages';
import { resourceTypeGeneralOptions } from 'osf-components/components/node-metadata-manager/component';

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
    target: (NodeModel | RegistrationModel);
    targetInstitutions: InstitutionModel[];
    targetLicense: LicenseModel;
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

    @tracked metadataRecord!: CustomFileMetadataRecordModel;
    @tracked targetMetadata!: CustomItemMetadataRecordModel;
    file: FileModel = this.args.file;
    @tracked target!: (NodeModel | RegistrationModel);
    @tracked targetInstitutions!: InstitutionModel[];
    @tracked targetLicense!: LicenseModel;
    @tracked changeset!: BufferedChangeset;
    @tracked inEditMode = false;
    @tracked userCanEdit!: boolean;
    resourceTypeGeneralOptions: string[] = resourceTypeGeneralOptions;
    languageCodes: LanguageCode[] = languageCodes;
    saveErrored = false;
    @or(
        'getGuidMetadata.isRunning',
        'getTarget.isRunning',
    )
    isGatheringData!: boolean;
    @alias('changeset.isDirty') isDirty!: boolean;
    @alias('save.isRunning') isSaving!: boolean;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert(
            'You will need pass in a FileModel object to the FileMetadataManager component to get metadata',
            Boolean(args.file instanceof FileModel),
        );
        try {
            taskFor(this.getGuidMetadata).perform();
            taskFor(this.getTarget).perform();
        } catch (e) {
            const errorTitle = this.intl.t('osf-components.file-metadata-manager.error-getting-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }

    get languageFromCode(){
        if (this.metadataRecord?.language){
            const languages = this.languageCodes.filter(item => item.code === this.metadataRecord.language);
            const language = languages[0];
            if(language){
                return language.name;
            }
        }
        return '';
    }

    @task
    @waitFor
    async getTarget() {
        this.target = await this.file.target as NodeModel;
        this.targetLicense = await this.target.license;
        this.targetInstitutions = await this.target.affiliatedInstitutions as InstitutionModel[];
        this.userCanEdit = this.target.currentUserPermissions.includes(Permission.Write);
        await taskFor(this.getTargetMetadata).perform();
    }

    @task
    @waitFor
    async getGuidMetadata() {
        const guidRecord = await this.store.findRecord('guid', this.file.guid, {
            include: 'custom_metadata',
            resolve: false,
        });
        this.metadataRecord = await guidRecord.customMetadata as CustomFileMetadataRecordModel;
        this.changeset = buildChangeset(this.metadataRecord, null);
    }

    @task
    @waitFor
    async getTargetMetadata() {
        const guidRecord = await this.store.findRecord('guid', this.target.id, {
            include: 'custom_metadata',
            resolve: false,
        });
        this.targetMetadata = await guidRecord.customMetadata as CustomItemMetadataRecordModel;
    }

    @action
    changeLanguage(selected: LanguageCode){
        if(selected){
            this.changeset.set('language', selected.code);
        } else {
            this.changeset.set('language', '');
        }
    }

    @action
    edit(){
        this.inEditMode = true;
    }

    @task
    @waitFor
    async cancel(){
        if (this.saveErrored){
            await this.metadataRecord.reload();
            this.saveErrored = false;
        }
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
            this.saveErrored = true;
            const errorTitle = this.intl.t('osf-components.file-metadata-manager.error-saving-metadata');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }

    get nodeWord() {
        if(this.target) {
            if (this.target.isRegistration) {
                return 'registration';
            }
            if (this.target.parent.id) {
                return 'component';
            }
        }
        return 'project';
    }
}
