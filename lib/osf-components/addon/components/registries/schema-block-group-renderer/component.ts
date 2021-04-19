import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';
import uniqueId from 'ember-osf-web/utils/unique-id';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class SchemaBlockGroupRenderer extends Component {
    // Required parameters
    schemaBlockGroup!: SchemaBlockGroup;
    renderStrategy!: Component;

    // Optional params
    disabled: boolean = false;
    shouldShowMessages: boolean = true;

    @alias('schemaBlockGroup.optionBlocks')
    optionBlocks!: SchemaBlock[];

    @alias('schemaBlockGroup.inputBlock.required')
    isRequired?: boolean;

    didReceiveAttrs() {
        assert('A schema group is required to render schema groups', Boolean(this.schemaBlockGroup));
        assert('A renderStrategy is required to render schemaBlockGroupRenderer', Boolean(this.renderStrategy));
    }

    @computed('schemaBlockGroup.groupType')
    get uniqueID() {
        return uniqueId([this.schemaBlockGroup.groupType]);
    }

    @computed('schemaBlockGroup.blocks')
    get nonOptionBlocks(): SchemaBlock[] | undefined {
        return !this.schemaBlockGroup.blocks
            ? undefined
            : this.schemaBlockGroup.blocks.filter(
                block => block.blockType !== 'select-input-option'
                    && block.blockType !== 'select-other-option',
            );
    }

    @computed('schemaBlockGroup.groupType')
    get isFieldsetGroup(): boolean {
        return (
            this.schemaBlockGroup.groupType === 'single-select-input'
            || this.schemaBlockGroup.groupType === 'multi-select-input'
        );
    }
}
