import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';

import SchemaBlockModel from 'ember-osf-web/models/schema-block';
import template from './template';

@layout(template)
@tagName('')
export default class SingleSelectInput extends Component {
    // Required param
    optionBlocks!: SchemaBlockModel[];

    didReceiveAttrs() {
        assert('single-select-input requires optionBlocks to render', Boolean(this.optionBlocks));
    }

    @computed('optionBlocks')
    get optionBlockValues() {
        return this.optionBlocks.map(item => item.displayText);
    }
}
