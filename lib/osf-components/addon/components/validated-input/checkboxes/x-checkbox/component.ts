import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
@tagName('')
export default class ValidatedInputCheckboxesXCheckbox<T> extends Component {
    // Required arguments
    relationArray?: DS.PromiseArray<T> | T[];

    option!: T;

    checkboxName!: string;

    ariaLabel!: string;

    disabled!: boolean;

    checkboxId!: string;

    @computed('option', '_relationArray.[]')
    get checked(): boolean {
        return this._relationArray.includes(this.option);
    }

    set checked(checked: boolean) {
        if (checked && !this.checked) {
            this._relationArray.pushObject(this.option);
        }
        if (!checked && this.checked) {
            this._relationArray.removeObject(this.option);
        }
    }

    @computed('relationArray.[]')
    get _relationArray(): T[] {
        if (this.relationArray) {
            if (Array.isArray(this.relationArray)) {
                return this.relationArray;
            }
            return this.relationArray.toArray();
        }
        return [];
    }
}
