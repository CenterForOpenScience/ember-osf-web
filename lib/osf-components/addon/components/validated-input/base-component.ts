// This component is derived from ember-cp-validations.
// See https://github.com/offirgolan/ember-cp-validations for more information
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { defineProperty } from '@ember/object';
import { alias as aliasMacro, oneWay as oneWayMacro } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { ResultCollection } from 'ember-cp-validations';
import DS from 'ember-data';
import defaultTo from 'ember-osf-web/utils/default-to';

export enum ValidationStatus {
    Hidden,
    Success,
    HasError,
    HasWarning,
}

export default abstract class BaseValidatedInput extends Component {
    // Required arguments
    model!: DS.Model;
    valuePath!: keyof DS.Model;

    // Optional arguments
    label?: string;
    ariaLabel?: string;
    placeholder?: string;
    disabled: boolean = defaultTo(this.disabled, false);
    showMessages: boolean = defaultTo(this.showMessages, true);

    // Private properties
    validation?: ResultCollection; // defined in constructor
    value: any; // defined in constructor

    @computed('showMessages', 'value', 'validation.{isInvalid,isValidating,warnings.[]}')
    get validationStatus(): ValidationStatus {
        const { showMessages, validation, value } = this;

        switch (true) {
        case !validation || !showMessages || validation.isValidating:
            return ValidationStatus.Hidden;
        case validation && validation.isInvalid:
            return ValidationStatus.HasError;
        case validation && !isEmpty(validation.warnings):
            return ValidationStatus.HasWarning;
        case isEmpty(value):
            return ValidationStatus.Hidden;
        default:
            return ValidationStatus.Success;
        }
    }

    constructor(...args: any[]) {
        super(...args);

        defineProperty(this, 'validation', oneWayMacro(`model.validations.attrs.${this.valuePath}`));
        defineProperty(this, 'value', aliasMacro(`model.${this.valuePath}`));
    }
}
