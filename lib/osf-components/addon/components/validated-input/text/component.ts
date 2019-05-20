import DS, { AttributesFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedText<M extends DS.Model> extends BaseValidatedComponent<M> {
    valuePath!: AttributesFor<M>;

    // Additional arguments
    password: boolean = defaultTo(this.password, false);
    onKeyUp?: () => void; // Action
}
