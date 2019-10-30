import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { computed } from '@ember-decorators/object';
import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class MultiSelectInput extends Component {
    // Required param
    optionBlocks!: SchemaBlock[];

    didReceiveAttrs() {
        assert('multi-select-input requires optionBlocks to render', Boolean(this.optionBlocks));
    }

    @computed('optionBlocks')
    get optionBlockValuesAndHelpText() {
        return this.optionBlocks.map(item => ({
            displayText: item.displayText,
            helpText: item.helpText,
        }));
    }
}
