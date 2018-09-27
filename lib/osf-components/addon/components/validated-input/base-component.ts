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
    valuePath!: string;

    // Optional arguments
    label?: string;
    ariaLabel?: string;
    placeholder?: string;
    disabled: boolean = defaultTo(this.disabled, false);
    messagesShown: boolean = defaultTo(this.messagesShown, true);

    // Private properties
    validation?: ResultCollection; // defined in constructor
    value: any; // defined in constructor

    @computed(
        'messagesShown',
        'value',
        'validation.{isInvalid,isValidating,warnings.[]}',
    )
    get validationStatus(): ValidationStatus {
        const { validation } = this;
        if (!this.messagesShown || !validation || validation.isValidating) {
            return ValidationStatus.Hidden;
        }
        if (validation.isInvalid) {
            return ValidationStatus.HasError;
        }
        if (!isEmpty(validation.warnings)) {
            return ValidationStatus.HasWarning;
        }
        return isEmpty(this.value) ? ValidationStatus.Hidden : ValidationStatus.Success;
    }

    constructor(...args: any[]) {
        super(...args);

        defineProperty(this, 'validation', oneWayMacro(`model.validations.attrs.${this.valuePath}`));
        defineProperty(this, 'value', aliasMacro(`model.${this.valuePath}`));
    }
}
