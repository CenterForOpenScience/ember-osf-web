import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ValidatedCheckboxes extends BaseValidatedComponent {
    // Additional required arguments
    options!: any[]; // Model instances that could be added to the hasMany
}
