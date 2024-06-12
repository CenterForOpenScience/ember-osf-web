
import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat, validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { DOIRegex } from 'ember-osf-web/utils/doi';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { taskFor } from 'ember-concurrency-ts';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import LicenseModel from 'ember-osf-web/models/license';
import { tracked } from '@glimmer/tracking';
import SubjectModel from 'ember-osf-web/models/subject';
import { validateSubjects } from 'ember-osf-web/packages/registration-schema/validations';
import PreprintModel, { PreprintLicenseRecordModel } from 'ember-osf-web/models/preprint';

/**
 * The Metadata Args
 */
interface MetadataArgs {
    manager: PreprintStateMachine;
}

interface MetadataForm {
    doi: string;
    originalPublicationDate: number;
    license: LicenseModel;
    licenseCopyrights: string[];
    licenseYear: string;
    subjects: SubjectModel[];
}

const MetadataFormValidation: ValidationObject<MetadataForm> = {
    doi: validateFormat({
        allowBlank: true,
        allowNone: true,
        ignoreBlank: true,
        regex: DOIRegex,
        type: 'invalid_doi',
    }),
    license: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    licenseCopyrights: [(key: string, newValue: string, oldValue: string, changes: any, content: any) => {
        if (changes['license'] && changes['license']?.requiredFields?.length > 0)  {
            return validatePresence({
                presence: true,
                ignoreBlank: true,
                type: 'empty',
            })(key, newValue, oldValue, changes, content);
        }
        return true;
    }],
    licenseYear: [(key: string, newValue: string, oldValue: string, changes: any, content: any) => {
        if (changes['license'] && changes['license']?.requiredFields?.length > 0)  {
            const yearRegex = /^((?!(0))[0-9]{4})$/;

            return validateFormat({
                allowBlank: false,
                allowNone: false,
                ignoreBlank: false,
                regex: yearRegex,
                type: 'year_format',
            })(key, newValue, oldValue, changes, content);
        }
        return true;
    }],
    subjects: validateSubjects(),
};

/**
 * The Metadata Component
 */
export default class Metadata extends Component<MetadataArgs>{
    @service store!: Store;
    metadataFormChangeset = buildChangeset(this.args.manager.preprint, MetadataFormValidation);
    showAddContributorWidget = true;
    @tracked displayRequiredLicenseFields = false;
    @tracked licenses = [] as LicenseModel[];
    license!: LicenseModel;
    preprint!: PreprintModel;
    originalPublicationDateMin = new Date(1900, 0, 1);
    today = new Date();
    originalPublicationDateMax = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        this.today.getDate(),
    );


    constructor(owner: unknown, args: MetadataArgs) {
        super(owner, args);

        this.preprint = this.args.manager.preprint;
        taskFor(this.loadLicenses).perform();
    }

    @task
    @waitFor
    private async loadLicenses()  {
        this.licenses = await this.args.manager.provider.queryHasMany('licensesAcceptable', {
            page: { size: 100 },
            sort: 'name',
        });

        this.license = await this.preprint.license;
        this.setLicenseFields();
    }

    @action
    toggleAddContributorWidget() {
        this.showAddContributorWidget = !this.showAddContributorWidget;
    }

    private setLicenseFields(): void {
        if (this.license?.hasRequiredFields) {
            this.metadataFormChangeset.set('licenseCopyrights',
                this.preprint.licenseRecord.copyright_holders.join(' '));
            this.metadataFormChangeset.set('licenseYear', this.preprint.licenseRecord.year);

        }
        this.displayRequiredLicenseFields = this.license?.hasRequiredFields;
    }

    private setHasRequiredFields(): void {
        this.license = this.metadataFormChangeset.get('license');
        this.displayRequiredLicenseFields = this.license.hasRequiredFields;
    }

    private updateLicenseRecord(): void {
        if (this.metadataFormChangeset.get('license').hasRequiredFields) {
            this.metadataFormChangeset.set('licenseRecord', {
                copyright_holders: [this.metadataFormChangeset.get('licenseCopyrights')],
                year: this.metadataFormChangeset.get('licenseYear'),

            } as PreprintLicenseRecordModel);
        } else {
            this.metadataFormChangeset.set('licenseRecord', undefined);
        }
    }

    @action
    public validate(): void {
        this.setHasRequiredFields();
        this.metadataFormChangeset.validate();
        if (this.metadataFormChangeset.isInvalid) {
            this.args.manager.validateMetadata(false);
            return;
        }

        this.updateLicenseRecord();
        this.metadataFormChangeset.execute();
        this.args.manager.validateMetadata(true);
    }
}
