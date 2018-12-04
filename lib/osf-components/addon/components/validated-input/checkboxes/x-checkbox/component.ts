import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@tagName('')
export default class ValidatedInputCheckboxesXCheckbox<T> extends Component {
    // Required arguments
    relationArray!: T[];
    option!: T;
    checkboxName!: string;
    ariaLabel!: string;
    disabled!: boolean;
    checkboxId!: string;

    @computed('option', 'relationArray.[]')
    get checked(): boolean {
        return this.relationArray.includes(this.option);
    }
    set checked(checked: boolean) {
        if (checked && !this.checked) {
            this.relationArray.pushObject(this.option);
        }
        if (!checked && this.checked) {
            this.relationArray.removeObject(this.option);
        }
    }
}
