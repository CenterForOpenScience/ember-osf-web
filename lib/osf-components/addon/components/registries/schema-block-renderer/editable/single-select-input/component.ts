import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import template from './template';

@layout(template)
@tagName('')
export default class SingleSelectInput extends Component {
    // Required param
    optionBlocks!: SchemaBlock[];

    didReceiveAttrs() {
        assert('single-select-input requires optionBlocks to render', Boolean(this.optionBlocks));
    }

    @computed('optionBlocks')
    get optionBlockValues() {
        return this.optionBlocks.map(item => item.displayText);
    }
}
