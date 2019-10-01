import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import { getSchemaBlockGroups, PageResponse, SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import template from './template';

@layout(template)
@tagName('')
export default class SchemaBlockGroupRenderer extends Component {
    // Required parameters
    schemaBlocks!: SchemaBlock[];
    registrationResponses!: PageResponse;

    didReceiveAttrs() {
        assert(
            'reviewFormRenderer requires schemaBlocks to render',
            Boolean(this.schemaBlocks),
        );
        assert(
            'reviewFormRenderer requires registrationResponses to render',
            Boolean(this.registrationResponses),
        );
    }

    @computed('schemaBlocks')
    get schemaBlockGroups() {
        return getSchemaBlockGroups(this.schemaBlocks);
    }
}
