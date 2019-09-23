import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { computed } from '@ember-decorators/object';
import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import template from './template';

@layout(template)
@tagName('')
export default class MultiSelectInput extends Component {
    // Required param
    optionBlocks!: SchemaBlock[];

    @computed('optionBlocks')
    get optionBlockValues() {
        return this.optionBlocks.map(item => item.displayText);
    }
}
