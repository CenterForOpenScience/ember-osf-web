import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

// import Changeset from 'ember-changeset';

import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';

import template from './template';

@layout(template)
@tagName('')
export default class SchemaBlockGroupRenderer extends Component {
    // Required parameters
    schemaBlockGroup!: SchemaBlockGroup;
    // changeset!: Changeset;

    // Optional params
    disabled: boolean = false;
    shouldShowMessages: boolean = true;

    // Check that the chunk is a multiselect
    @computed('schemaBlockGroup')
    get hasMultipleOptions(): boolean {
        return this.schemaBlockGroup.groupType === 'multi-select-input'
            || this.schemaBlockGroup.groupType === 'single-select-input';
    }

    @computed('hasMultipleOptions')
    get optionBlocks(): SchemaBlock[] {
        return this.schemaBlockGroup.optionBlocks || [];
    }

    @computed('schemaBlockGroup.blocks')
    get nonOptionBlocks(): SchemaBlock[] | undefined {
        return !this.schemaBlockGroup.blocks ?
            undefined :
            this.schemaBlockGroup.blocks.filter(
                block =>
                    block.blockType !== 'select-input-option' &&
                    block.blockType !== 'select-other-option',
            );
    }
}
