import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import SchemaBlock from 'ember-osf-web/models/schema-block';
import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

@layout(template)
@tagName('')
export default class SchemaBlockRenderer extends Component {
    // Required params
    schemaBlock!: SchemaBlock;
    renderStrategy!: Component;

    // Optional params
    disabled: boolean = defaultTo(this.disabled, false);
    shouldShowMessages: boolean = defaultTo(this.shouldShowMessages, true);

    didReceiveAttrs() {
        assert('schema-block-renderer requires a schemaBlock to render', Boolean(this.schemaBlock));
        assert('schema-block-renderer requires a renderStrategy to render', Boolean(this.renderStrategy));
    }
}
