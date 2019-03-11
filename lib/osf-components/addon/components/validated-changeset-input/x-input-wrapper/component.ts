import { className, classNames } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { equal } from '@ember-decorators/object/computed';
import Component from '@ember/component';

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
        return `${this.elementId}__${this.valuePath}`;
    }
}
