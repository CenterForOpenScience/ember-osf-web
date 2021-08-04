import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { waitFor } from '@ember/test-waiters';
import { restartableTask } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import RevisionModel from 'ember-osf-web/models/revision';
import { getSchemaBlockGroups, SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';

import template from './template';

@tagName('')
@layout(template)
export default class RegistrationFormViewSchemaBlocks extends Component {
    @service store!: Store;
    // Required parameter
    registration?: Registration;
    revisionId?: string;

    // Private properties
    revision?: RevisionModel;
    schemaBlocks?: SchemaBlock[];
    schemaBlockGroups?: SchemaBlockGroup[];
    responses?: { [key: string]: string };

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
    async fetchSchemaBlocks() {
        let revision;
        if (this.revisionId) {
            revision = await this.store.findRecord('revision', this.revisionId);
            this.set('revision', revision);
        }
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
    }
}
