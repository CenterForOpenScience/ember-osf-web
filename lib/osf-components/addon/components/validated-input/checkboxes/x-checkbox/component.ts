import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import styles from './styles';
import layout from './template';

@tagName('')
@localClassNames('ValidatedInputCheckboxesXCheckbox')
export default class ValidatedInputCheckboxesXCheckbox extends Component {
    layout = layout;
    styles = styles;

    // Required arguments
    relationArray!: any[];
    option!: any;
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
