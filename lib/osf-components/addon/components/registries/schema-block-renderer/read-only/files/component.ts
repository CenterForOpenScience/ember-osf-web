import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { defineProperty } from '@ember/object';
import { alias } from '@ember/object/computed';
import { ChangesetDef } from 'ember-changeset/types';

import { layout } from 'ember-osf-web/decorators/component';
import { RegistrationResponse, SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ReadOnlyFiles extends Component {
    // Required params
    schemaBlock!: SchemaBlock;
    registrationResponses!: RegistrationResponse;
    changeset!: ChangesetDef;

    responses?: RegistrationResponse[keyof RegistrationResponse];

    didReceiveAttrs() {
        assert(
            'Registries::SchemaBlockRenderer::ReadOnly::Files requires a schemaBlock',
            Boolean(this.schemaBlock),
        );
        assert(
            'Registries::SchemaBlockRenderer::ReadOnly::Files requires registrationResponses to render',
            Boolean(this.registrationResponses),
        );
        assert(
            'Registries::SchemaBlockRenderer::ReadOnly::Files requires @changeset to render',
            Boolean(this.changeset),
        );
    }

    init() {
        super.init();
        defineProperty(this, 'responses', alias(`registrationResponses.${this.schemaBlock.registrationResponseKey}`));
    }

    @computed('responses')
    get hasResponses(): boolean {
        return Boolean(this.responses && this.responses.length > 0);
    }

    @computed('changeset.isValid')
    get isValidating() {
        return this.changeset.isValidating();
    }
}
