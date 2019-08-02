import DS, { AttributesFor, RelationshipsFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedCheckbox<M extends DS.Model> extends BaseValidatedComponent<M> {
    valuePath!: AttributesFor<M> | RelationshipsFor<M>;
}
