// This component is derived from ember-cp-validations.
// See https://github.com/offirgolan/ember-cp-validations for more information
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
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
    shouldShowMessages: boolean = defaultTo(this.shouldShowMessages, true);

    // Private properties
    @service intl!: Intl;

    validation?: ResultCollection; // defined in constructor
    value: any; // defined in constructor

    @computed('validation.options')
    get isRequired(): boolean {
        if (!this.validation) {
            return false;
        }
        const { options } = this.validation;
        return options && options.presence && options.presence.presence;
    }

    @computed('placeholder', 'isRequired')
    get _placeholder(): string {
        return this.placeholder || this.intl.t(this.isRequired ? 'general.required' : 'general.optional');
    }

    @computed(
        'shouldShowMessages',
        'value',
        'validation.{isInvalid,isValidating,warnings.[]}',
    )
    get validationStatus(): ValidationStatus {
        const { shouldShowMessages, validation, value } = this;

        switch (true) {
        case !validation || !shouldShowMessages || validation.isValidating:
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
