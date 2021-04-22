import Model from '@ember-data/model';
import { action, computed } from '@ember/object';
import { BufferedChangeset } from 'ember-changeset/types';
import { AttributesFor, RelationshipsFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedPowerSelect<M extends Model> extends BaseValidatedComponent<M> {
    valuePath!: AttributesFor<M> | RelationshipsFor<M>;

    onchange?: (value: string) => void;

    search!: () => any;
    noMatchesMessage?: string;
    options!: any[];
    searchEnabled?: boolean;
    placeholder? = this.placeholder;

    // Set renderInPlace to true when <powerselect> is rendered in <bsModal>
    // BsModal has z-index 1050 while power-select has 1000.
    renderInPlace? = false;

    @computed('model', 'changeset')
    get modelOrChangeset(): M | BufferedChangeset & M | undefined {
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
