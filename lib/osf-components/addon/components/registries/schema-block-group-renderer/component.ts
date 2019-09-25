import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import Changeset from 'ember-changeset';

import { layout } from 'ember-osf-web/decorators/component';
import NodeModel from 'ember-osf-web/models/node';
import { SchemaBlock, SchemaBlockGroup } from 'ember-osf-web/packages/registration-schema';
import defaultTo from 'ember-osf-web/utils/default-to';
import { uniqueId } from 'osf-components/helpers/unique-id';
import template from './template';

@layout(template)
@tagName('')
export default class SchemaBlockGroupRenderer extends Component {
    // Required parameters
    schemaBlockGroup!: SchemaBlockGroup;
    changeset!: Changeset;
    node!: NodeModel;

    // Optional params
    disabled: boolean = defaultTo(this.disabled, false);
    shouldShowMessages: boolean = defaultTo(this.shouldShowMessages, true);

    @alias('schemaBlockGroup.optionBlocks')
    optionBlocks!: SchemaBlock[];

    didReceiveAttrs() {
        assert('A schema group is required to render schema groups', Boolean(this.schemaBlockGroup));
        assert('A changeset is required to render schema groups', Boolean(this.changeset));
        assert('A node is required to render schema groups', Boolean(this.node));
    }

    @computed('schemaBlockGroup')
    get uniqueID() {
        return uniqueId([this.schemaBlockGroup.groupType]);
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
