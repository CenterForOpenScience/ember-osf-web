import { action, computed } from '@ember/object';
import { ChangesetDef } from 'ember-changeset/types';
import DS, { AttributesFor, RelationshipsFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedPowerSelect<M extends DS.Model> extends BaseValidatedComponent<M> {
    valuePath!: AttributesFor<M> | RelationshipsFor<M>;

    onchange?: (value: string) => void;

    search: () => any = this.search;

    noMatchesMessage?: string = this.noMatchesMessage;

    options: any[] = this.options;

    searchEnabled?: boolean = this.searchEnabled;

    placeholder?: string = this.placeholder;

    // Set renderInPlace to true when <powerselect> is rendered in <bsModal>
    // BsModal has z-index 1050 while power-select has 1000.
    renderInPlace?: boolean = defaultTo(this.renderInPlace, false);

    @computed('model', 'changeset')
    get modelOrChangeset(): M | ChangesetDef & M | undefined {
        return this.model || this.changeset;
    }

    @action
    powerSelectChanged(value: string) {
        if (this.modelOrChangeset && this.valuePath) {
            this.modelOrChangeset.set(this.valuePath, value);
        }

        if (this.onchange) {
            this.onchange(value);
        }
    }
}
