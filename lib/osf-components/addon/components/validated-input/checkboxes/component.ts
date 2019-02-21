import { assert } from '@ember/debug';

import isChangeset from 'ember-changeset/utils/is-changeset';
import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ValidatedCheckboxes extends BaseValidatedComponent {
    // Additional required arguments
    options!: any[]; // Model instances that could be added to the hasMany

    constructor(...args: any[]) {
        super(...args);
        if (this.model) {
            assert(
                'validated-input/checkboxes expects a model to be passed in to actualModel',
                !isChangeset(this.model),
            );
            assert(
                'validated-input/checkboxes expects valuePath to lead to a hasMany relation',
                !isChangeset(this.model) && Boolean(this.model.hasMany(this.valuePath)),
            );
        }
    }
}
