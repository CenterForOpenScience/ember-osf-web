import { action } from '@ember-decorators/object';
import DS, { AttributesFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedDatePicker<M extends DS.Model> extends BaseValidatedComponent<M> {
    valuePath!: AttributesFor<M>;

    @action
    forceParse(component: any) {
        component._forceParse();
    }
}
