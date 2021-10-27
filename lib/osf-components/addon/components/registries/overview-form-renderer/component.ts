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
    registration?: Registration;
    revisionId?: string;

    // Optional parameters
    updateResponseIds?: string[];

    // Private properties
    revision?: SchemaResponseModel;
    schemaBlocks?: SchemaBlock[];
    schemaBlockGroups?: SchemaBlockGroup[];
    responses?: { [key: string]: string };

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
    async fetchSchemaBlocks() {
        try {
            let revision;
            if (this.revisionId) {
                revision = await this.store.findRecord('schema-response', this.revisionId);
            }
            this.set('revision', revision);
            if (this.registration) {
                const registrationSchema = await this.registration.registrationSchema;
                const responses = revision ? revision.revisionResponses : this.registration.registrationResponses;
                const schemaBlocksRef = registrationSchema.hasMany('schemaBlocks');
                const schemaBlocks = schemaBlocksRef.ids().length
                    ? schemaBlocksRef.value() : (await registrationSchema.loadAll('schemaBlocks'));
                const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks as SchemaBlock[]);
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
        assert('OverviewFormRenderer needs a registration or revisionId',
            Boolean(this.registration || this.revisionId));
    }
}
