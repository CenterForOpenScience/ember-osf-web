import Model from '@ember-data/model';
import { action } from '@ember/object';
import { RelationshipsFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';

import BaseValidatedComponent from '../base-component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ValidatedCheckboxes<M extends Model> extends BaseValidatedComponent<M> {
    valuePath!: RelationshipsFor<M>;

    // Additional required arguments
    options!: any[]; // Model instances that could be added to the hasMany
    onCheckCallback?: () => void;

    selectedOptions: unknown[] = [];

    didReceiveAttrs() {
        if (this.changeset) {
            const values = this.changeset.get(this.valuePath) as unknown as unknown[];
            this.selectedOptions = (values || []).slice();
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

                if (this.onCheckCallback) {
                    this.onCheckCallback();
                }
            }
        }
    }
}
