import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import template from './template';

@layout(template)
@tagName('')
export default class SingleSelectInput extends Component {
    // Required param
    optionBlocks!: SchemaBlock[];

    // Private properties
    helpTextMapping: Record<string, string | undefined> = {};

    didReceiveAttrs() {
        assert(
            'SchemaBlockRenderer::Editable::SingleSelectInput requires optionBlocks to render',
            Boolean(this.optionBlocks),
        );
        this.optionBlocks.filter(option => Boolean(option.displayText)).forEach(option => {
            this.helpTextMapping[option.displayText!] = option.helpText;
        });
    }

    @computed('optionBlocks')
    get optionBlockValues() {
        return this.optionBlocks.map(item => item.displayText);
    }
}
