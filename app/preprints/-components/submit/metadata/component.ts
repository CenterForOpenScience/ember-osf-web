
import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat} from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { DOIRegex } from 'ember-osf-web/utils/doi';

/**
 * The Metadata Args
 */
interface MetadataArgs {
    manager: PreprintStateMachine;
}

interface MetadataForm {
    publicationDoi: string;
}

const MetadataFormValidation: ValidationObject<MetadataForm> = {
    publicationDoi: validateFormat({
        allowBlank: true,
        allowNone: true,
        ignoreBlank: true,
        regex: DOIRegex,
        type: 'invalid_doi',
    }),
};

/**
 * The Metadata Component
 */
export default class Metadata extends Component<MetadataArgs>{
    metadataFormChangeset = buildChangeset(this.args.manager.preprint, MetadataFormValidation);

    @action
    public validate(): void {
        this.metadataFormChangeset.validate();
        if (this.metadataFormChangeset.isInvalid) {
            return;
        }
        this.metadataFormChangeset.execute();
        this.args.manager.validateMetadata();
    }
}
