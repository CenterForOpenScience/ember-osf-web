
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

/**
 * The Metadata Args
 */
interface MetadataArgs {
    manager: PreprintStateMachine;
}

interface MetadataForm {
    publicationDoi: string;
    publicationYear: number;
    publicationCitation: string;
    license: LicenseModel;
    subjects: SubjectModel[];
}

const MetadataFormValidation: ValidationObject<MetadataForm> = {
    publicationDoi: validateFormat({
        allowBlank: true,
        allowNone: true,
        ignoreBlank: true,
        regex: DOIRegex,
        type: 'invalid_doi',
    }),
    publicationYear: validateFormat({
        allowBlank: true,
        allowNone: true,
        ignoreBlank: true,
        regex: /^((?!(0))[0-9]{4})$/,
        type: 'year_format',
    }),
    license: validatePresence({
        presence: true,
        ignoreBlank: true,
        type: 'empty',
    }),
    subjects: validateSubjects(),
};

/**
 * The Metadata Component
 */
export default class Metadata extends Component<MetadataArgs>{
    @service store!: Store;
    metadataFormChangeset = buildChangeset(this.args.manager.preprint, MetadataFormValidation);
    showAddContributorWidget = true;
    @tracked licenses = [] as LicenseModel[];
    @tracked license!: LicenseModel;

    constructor(owner: unknown, args: MetadataArgs) {
        super(owner, args);

        taskFor(this.loadLicenses).perform();
    }

    @task
    @waitFor
    private async loadLicenses()  {
        this.licenses = await this.args.manager.provider.queryHasMany('licensesAcceptable', {
            page: { size: 100 },
            sort: 'name',
        });
    }

    @action
    toggleAddContributorWidget() {
        this.showAddContributorWidget = !this.showAddContributorWidget;
    }

    @action
    public validate(): void {
        this.metadataFormChangeset.validate();
        if (this.metadataFormChangeset.isInvalid) {
            this.args.manager.validateMetadata(false);
            return;
        }
        this.metadataFormChangeset.execute();
        this.args.manager.validateMetadata(true);
    }
}
