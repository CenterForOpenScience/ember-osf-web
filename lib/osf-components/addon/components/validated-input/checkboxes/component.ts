import { assert } from '@ember/debug';
import DS, { RelationshipsFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ValidatedCheckboxes<M extends DS.Model> extends BaseValidatedComponent<M> {
    valuePath!: RelationshipsFor<M>;

    // Additional required arguments
    options!: any[]; // Model instances that could be added to the hasMany

    constructor(...args: any[]) {
        super(...args);
        if (this.model) {
            assert(
                'validated-input/checkboxes expects valuePath to lead to a hasMany relation',
                Boolean(this.model.hasMany(this.valuePath)),
            );
        } else {
            assert(
                'validated-input/checkboxes expects a model to be passed in',
            );
        }
    }
}
