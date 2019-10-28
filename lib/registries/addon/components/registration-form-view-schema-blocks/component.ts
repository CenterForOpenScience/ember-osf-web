import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import { getSchemaBlockGroups, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class RegistrationFormViewSchemaBlocks extends Component {
    registration?: Registration;
    schemaBlockGroups?: SchemaBlockGroup[];
    node?: NodeModel;

    async didReceiveAttrs() {
        if (this.registration) {
            const registrationSchema = await this.registration.registrationSchema;
            const schemaBlocks = await registrationSchema.loadAll('schemaBlocks');
            const schemaBlockGroups = getSchemaBlockGroups(schemaBlocks);
            const node = await this.registration.registeredFrom;
            this.set('schemaBlockGroups', schemaBlockGroups);
            this.set('node', node);
        }
    }
}
