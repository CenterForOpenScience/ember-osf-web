import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';

import { tagName } from '@ember-decorators/component';
import template from './template';

@layout(template)
@tagName('')
export default class FormControlWrapper extends Component {
    // Required arguments
    changeset!: any;
    valuePath!: string;

    // Optional arguments
    errors?: string;
    label?: string;
    id?: string;

    @computed('elementId', 'valuePath')
    get inputElementId() {
        return this.id ? this.id : `${this.elementId}__${this.valuePath}`;
    }
}
