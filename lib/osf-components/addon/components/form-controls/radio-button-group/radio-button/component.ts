import { action } from '@ember/object';
import Component from '@glimmer/component';
import { BufferedChangeset } from 'ember-changeset/types';

import { RadioButtonOption } from 'osf-components/components/form-controls/radio-button-group/component';

/**
 * The Radio Button Args
 */
interface RadioButtonArgs{
    option: string | RadioButtonOption;
    valuePath: string;
    changeset: BufferedChangeset;
    disabled: boolean;
    helpTextMapping?: any;
    onchange?: (_: string | number | boolean) => void;
}

export default class FormControlRadioButton extends Component<RadioButtonArgs> {
    public get displayText(): string | number | boolean {
        if (typeof this.args.option ===  'string') {
            return this.args.option;
        }  else {
            return this.args.option.displayText !== undefined ? this.args.option.displayText : '';
        }
    }

    public get isValueChecked(): boolean {
        return this.args.changeset.get(this.args.valuePath) === this.getValue;
    }

    public get getValue(): string | number | boolean {
        if (typeof this.args.option ===  'string') {
            return this.args.option;
        }  else {
            return this.args.option.inputValue !== undefined ? this.args.option.inputValue : '';
        }
    }

    @action
    public updateChangeset(): void {
        this.args.changeset.set(this.args.valuePath, this.getValue);
        if (this.args.onchange) {
            this.args.onchange(this.getValue);
        }
    }
}
