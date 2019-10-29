import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import { getSchemaBlockGroups, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class RegistrationFormViewSchemaBlocks extends Component.extend({
    fetchSchemaBlocks: task(function *(this: RegistrationFormViewSchemaBlocks) {
        if (this.registration) {
            const registrationSchema = yield this.registration.registrationSchema;
            const schemaBlocks = yield registrationSchema.loadAll('schemaBlocks');
            const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks);
            this.set('schemaBlockGroups', schemaBlockGroups);
        }
    }).on('didReceiveAttrs'),
}) {
    // Required parameter
    registration?: Registration;

    // Private properties
    schemaBlockGroups?: SchemaBlockGroup[];
}
