import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import Changeset from 'ember-changeset';

import defaultTo from 'ember-osf-web/utils/default-to';

import { layout } from 'ember-osf-web/decorators/component';
import SchemaBlock from 'ember-osf-web/models/schema-block';
import template from './template';

@layout(template)
@tagName('')
export default class SchemaBlockRenderer extends Component {
    // Required params
    schemaBlock!: SchemaBlock;
    changeset!: Changeset;

    // Optional params
    disabled: boolean = defaultTo(this.disabled, false);
    shouldShowMessages: boolean = defaultTo(this.shouldShowMessages, true);
}
