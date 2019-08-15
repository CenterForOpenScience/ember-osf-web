import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import Changeset from 'ember-changeset';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
@tagName('')
export default class SchemaChunk extends Component {
    // Required parameters
    changeset!: Changeset;
    answerId!: string;
    chunkId!: string;

    // Optional parameters
    disabled: boolean = defaultTo(this.disabled, false);
    shouldShowMessages: boolean = defaultTo(this.shouldShowMessages, true);
}
