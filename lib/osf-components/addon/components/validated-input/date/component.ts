import { action } from '@ember-decorators/object';

import BaseValidatedComponent from '../base-component';
import layout from './template';

export default class ValidatedDatePicker extends BaseValidatedComponent {
    layout = layout;

    @action
    forceParse(component: any) {
        component._forceParse();
    }
}
