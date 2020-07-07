import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { task } from 'ember-concurrency-decorators';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import { getSchemaBlockGroups, SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';

import template from './template';

@tagName('')
@layout(template)
export default class RegistrationFormViewSchemaBlocks extends Component {
    // Required parameter
    registration?: Registration;

    // Private properties
    schemaBlocks?: SchemaBlock[];
    schemaBlockGroups?: SchemaBlockGroup[];

    @task({ withTestWaiter: true, on: 'didReceiveAttrs', restartable: true })
    fetchSchemaBlocks = task(function *(this: RegistrationFormViewSchemaBlocks) {
        if (this.registration) {
            const registrationSchema = yield this.registration.registrationSchema;
            const schemaBlocksRef = registrationSchema.hasMany('schemaBlocks');
            const schemaBlocks = schemaBlocksRef.ids().length
                ? schemaBlocksRef.value() : (yield registrationSchema.loadAll('schemaBlocks'));
            const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks);
            this.set('schemaBlocks', schemaBlocks);
            this.set('schemaBlockGroups', schemaBlockGroups);
        }
    });
}
