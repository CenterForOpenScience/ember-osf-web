import { assert } from '@ember/debug';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { waitFor } from '@ember/test-waiters';
import { restartableTask } from 'ember-concurrency';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import { getSchemaBlockGroups, SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import template from './template';

@tagName('')
@layout(template)
export default class RegistrationFormViewSchemaBlocks extends Component {
    @service store!: Store;
    @service toast!: Toast;
    // Required parameter
    registration!: Registration;
    revision!: SchemaResponseModel;

    // Optional parameters
    updatedResponseIds?: string[];

    // Private properties
    schemaBlocks?: SchemaBlock[];
    schemaBlockGroups?: SchemaBlockGroup[];
    responses?: { [key: string]: string };

    get showMetadata() {
        return !this.registration.latestResponse.get('isOriginalResponse');
    }

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
    async fetchSchemaBlocks() {
        try {
            if (this.revision && this.registration) {
                const registrationSchema = await this.registration.registrationSchema;
                const responses = this.revision.revisionResponses;
                const schemaBlocks: SchemaBlock[] = await registrationSchema.loadAll('schemaBlocks');
                const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks, this.updatedResponseIds);
                this.set('schemaBlocks', schemaBlocks);
                this.set('schemaBlockGroups', schemaBlockGroups);
                this.set('responses', responses);
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }

    didReceiveAttrs() {
        assert('OverviewFormRenderer needs a registration',Boolean(this.registration));
    }
}
