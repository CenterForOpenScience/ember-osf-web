import { assert } from '@ember/debug';
import BaseValidatedComponent from '../base-component';
import styles from './styles';
import layout from './template';

export default class ValidatedCheckboxes extends BaseValidatedComponent {
    layout = layout;
    styles = styles;

    // Additional required arguments
    options!: any[]; // Model instances that could be added to the hasMany

    constructor(...args: any[]) {
        super(...args);

        assert(
            'validated-input/checkboxes expects valuePath to lead to a hasMany relation',
            Boolean(this.model.hasMany(this.valuePath as any)),
        );
    }
}
