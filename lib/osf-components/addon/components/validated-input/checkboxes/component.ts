import { action } from '@ember-decorators/object';
import { assert } from '@ember/debug';
import DS, { RelationshipsFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import { copy } from '@ember/object/internals';
import BaseValidatedComponent from '../base-component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ValidatedCheckboxes<M extends DS.Model> extends BaseValidatedComponent<M> {
    valuePath!: RelationshipsFor<M>;

    // Additional required arguments
    options!: any[]; // Model instances that could be added to the hasMany

    selectedOptions: any = [];

    constructor(...args: any[]) {
        super(...args);
        if (this.model && this.changeset) {
            assert('validated-input/checkboxes cannot take both a model and a changeset', false);
        }
        if (this.model) {
            assert(
                'validated-input/checkboxes expects valuePath to lead to a hasMany relation for models',
                Boolean(this.model.hasMany(this.valuePath)),
            );
        }
        if (this.changeset) {
            const valuePathArray = this.changeset.get(this.valuePath);
            assert(
                'validated-input/checkboxes expects valuePath to lead to a array attribute for changesets',
                Boolean(valuePathArray instanceof Array),
            );
        }
    }

    didReceiveAttrs() {
        if (this.changeset) {
            this.selectedOptions = copy(this.changeset.get(this.valuePath), true);
        }
    }

    @action
    onCheck(item: any, event: Event) {
        if (this.changeset) {
            if (event && item) {
                const target = event.target as HTMLInputElement;
                if (target.checked) {
                    this.selectedOptions.pushObject(item);
                } else {
                    this.selectedOptions.removeObject(item);
                }
                this.changeset.set(this.valuePath, this.selectedOptions);
            }
        }
    }
}
