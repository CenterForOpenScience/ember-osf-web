import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { computed } from '@ember-decorators/object';
import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import template from './template';

@layout(template)
@tagName('')
export default class RadioInput extends Component {
    // Required param
    optionBlocks!: SchemaBlock[];

    // Private properties
    helpTextMapping: any = {};

    didReceiveAttrs() {
        assert('radio-input requires optionBlocks to render', Boolean(this.optionBlocks));
        this.optionBlocks.forEach(option => {
            this.helpTextMapping[option.displayText!] = option.helpText;
        });
    }

    @computed('optionBlocks')
    get optionBlockValues() {
        return this.optionBlocks.map(item => item.displayText);
    }
}
