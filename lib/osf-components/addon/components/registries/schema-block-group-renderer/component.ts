import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

// import Changeset from 'ember-changeset';

import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';

import { alias } from '@ember-decorators/object/computed';
import Changeset from 'ember-changeset';
import template from './template';

@layout(template)
@tagName('')
export default class SchemaBlockGroupRenderer extends Component {
    // Required parameters
    schemaBlockGroup!: SchemaBlockGroup;
    changeset!: Changeset;

    // Optional params
    disabled: boolean = false;
    shouldShowMessages: boolean = true;

    @alias('schemaBlockGroup.optionBlocks')
    optionBlocks!: SchemaBlock[];

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
