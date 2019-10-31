import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class SingleSelectInput extends Component {
    // Required param
    optionBlocks!: SchemaBlock[];

    // Private properties
    helpTextMapping: any = {};

    didReceiveAttrs() {
        assert('single-select-input requires optionBlocks to render', Boolean(this.optionBlocks));
        this.optionBlocks.forEach(option => {
            this.helpTextMapping[option.displayText!] = option.helpText;
        });
    }

    @computed('optionBlocks')
    get optionBlockValues() {
        return this.optionBlocks.map(item => item.displayText);
    }
}
