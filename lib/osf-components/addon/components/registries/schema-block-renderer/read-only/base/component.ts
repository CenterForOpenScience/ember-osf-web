import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import { PageResponse, SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import template from './template';

@layout(template)
@tagName('')
export default class BaseReadOnlyComponent extends Component {
    // Required param
    schemaBlock!: SchemaBlock;
    registrationResponses!: PageResponse;

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

    @computed('registrationResponses')
    get readOnlyValue() {
        const response = this.registrationResponses[this.schemaBlock.registrationResponseKey!];
        if (Array.isArray(response)) {
            return response.join(', ');
        }

        return response;
    }
}
