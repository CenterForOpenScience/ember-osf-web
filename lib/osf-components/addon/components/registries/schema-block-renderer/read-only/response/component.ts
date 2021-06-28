import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import { RegistrationResponse, SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ReadOnlyResponse extends Component {
    // Required param
    schemaBlock!: SchemaBlock;
    registrationResponses!: RegistrationResponse;

    didReceiveAttrs() {
        assert(
            `schema-block-renderer/read-only/${this.schemaBlock.blockType} requires a schemaBlock to render`,
            Boolean(this.schemaBlock),
        );
        assert(
            `schema-block-renderer/read-only/${this.schemaBlock.blockType} requires registrationResponses to render`,
            Boolean(this.registrationResponses),
        );
    }

    @computed('registrationResponses', 'schemaBlock.registrationResponseKey')
    get readOnlyValue() {
        const response = this.registrationResponses[this.schemaBlock.registrationResponseKey!];
        if (Array.isArray(response)) {
            return response.join(', ');
        }

        return response;
    }
}
