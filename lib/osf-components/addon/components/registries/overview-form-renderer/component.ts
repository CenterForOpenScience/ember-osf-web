import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { restartableTask } from 'ember-concurrency-decorators';

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

    @restartableTask({ withTestWaiter: true, on: 'didReceiveAttrs' })
    async fetchSchemaBlocks() {
        if (this.registration) {
            const registrationSchema = await this.registration.registrationSchema;
            const schemaBlocksRef = registrationSchema.hasMany('schemaBlocks');
            const schemaBlocks = schemaBlocksRef.ids().length
                ? schemaBlocksRef.value() as unknown as SchemaBlock[]
                : (await registrationSchema.loadAll('schemaBlocks'));
            const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks);
            this.set('schemaBlocks', schemaBlocks);
            this.set('schemaBlockGroups', schemaBlockGroups);
        }
    }
}
