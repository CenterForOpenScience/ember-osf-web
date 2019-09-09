import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { bool } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@tagName('')
export default class SchemaBlockGroupRenderer extends Component {
    // Required parameters
    schemaBlockGroup!: RegistrationSchema;
    changeset!: Changeset;
    @bool('schemaBlockGroup.inputBlock') hasInputBlock!: boolean;

    // Check that the chunk is a multiselect
    @computed('schemaBlockGroup')
    get hasMultipleOptions(this: SchemaBlockGroupRenderer): boolean {
        return this.schemaBlockGroup.groupType === 'multi-select-input'
            || this.schemaBlockGroup.groupType === 'single-select-input';
    }
}
