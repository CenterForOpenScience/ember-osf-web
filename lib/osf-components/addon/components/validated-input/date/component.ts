import { action } from '@ember-decorators/object';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedDatePicker extends BaseValidatedComponent {
    @action
    forceParse(component: any) {
        component._forceParse();
    }
}
