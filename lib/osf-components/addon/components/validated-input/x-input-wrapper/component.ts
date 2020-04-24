import { className, classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

import { layout } from 'ember-osf-web/decorators/component';

import { ValidationStatus } from '../base-component';
import template from './template';

@layout(template)
@classNames('form-group')
export default class ValidatedXInputWrapper extends Component {
    // Required arguments
    changeset!: any;

    valuePath!: string;

    validationStatus!: ValidationStatus;

    // Optional arguments
    errors?: string;

    label?: string;

    id?: string;

    @className
    @equal('validationStatus', ValidationStatus.HasError)
    hasError!: boolean;

    @className
    @equal('validationStatus', ValidationStatus.HasWarning)
    hasWarning!: boolean;

    @className
    @equal('validationStatus', ValidationStatus.Success)
    hasSuccess!: boolean;

    @computed('elementId', 'valuePath')
    get inputElementId() {
        return this.id ? this.id : `${this.elementId}__${this.valuePath}`;
    }
}
