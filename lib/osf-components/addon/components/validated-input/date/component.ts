import { action } from '@ember/object';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedDatePicker<M extends DS.Model> extends BaseValidatedComponent<M> {
    @action
    onChange(newValue: Date[]) {
        this.set('value', newValue[0]);
    }
}
