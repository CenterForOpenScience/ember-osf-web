import { action } from '@ember-decorators/object';
import BaseValidatedComponent from '../base-component';
import layout from './template';

export default class ValidatedPowerSelect extends BaseValidatedComponent {
    layout = layout;

    onchange?: (value: string) => void;

    search: () => any = this.search;
    noMatchesMessage?: string = this.noMatchesMessage;
    options: any[] = this.options;

    @action
    powerSelectChanged(this: ValidatedPowerSelect, value: string) {
        if (this.model && this.valuePath) {
            this.model.set(this.valuePath, value);
        }

        if (this.onchange) {
            this.onchange(value);
        }
    }
}
