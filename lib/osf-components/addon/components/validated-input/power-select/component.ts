import { action } from '@ember-decorators/object';
import DS, { AttributesFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedPowerSelect<M extends DS.Model> extends BaseValidatedComponent<M> {
    valuePath!: AttributesFor<M>;

    onchange?: (value: string) => void;

    search: () => any = this.search;
    noMatchesMessage?: string = this.noMatchesMessage;
    options: any[] = this.options;
    searchEnabled?: boolean = this.searchEnabled;
    placeholder?: string = this.placeholder;

    @action
    powerSelectChanged(value: string) {
        if (this.model && this.valuePath) {
            this.model.set(this.valuePath, value);
        }

        if (this.onchange) {
            this.onchange(value);
        }
    }
}
