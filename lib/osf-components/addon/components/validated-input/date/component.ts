import Model from '@ember-data/model';
import { action } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedDatePicker<M extends Model> extends BaseValidatedComponent<M> {
    @action
    onChange(newValue: Date[]) {
        this.set('value', newValue[0]);
    }
}
