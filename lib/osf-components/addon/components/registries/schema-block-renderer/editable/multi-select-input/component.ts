import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { computed } from '@ember-decorators/object';
import { layout } from 'ember-osf-web/decorators/component';
import SchemaBlockModel from 'ember-osf-web/models/schema-block';
import template from './template';

@layout(template)
@tagName('')
export default class MultiSelectInput extends Component {
    // Required param
    optionBlocks!: SchemaBlockModel[];

    didReceiveAttrs() {
        assert('multi-select-input requires optionBlocks to render', Boolean(this.optionBlocks));
    }

    @computed('optionBlocks')
    get optionBlockValues() {
        return this.optionBlocks.map(item => item.displayText);
    }
}
