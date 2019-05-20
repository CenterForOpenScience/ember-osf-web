// This component is derived from ember-cp-validations.
// See https://github.com/offirgolan/ember-cp-validations for more information
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { defineProperty } from '@ember/object';
import {
    alias as aliasMacro,
    bool as boolMacro,
    oneWay as oneWayMacro,
} from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { ChangesetDef } from 'ember-changeset/types';
import { ResultCollection } from 'ember-cp-validations';
import DS, { AttributesFor, RelationshipsFor } from 'ember-data';
import I18n from 'ember-i18n/services/i18n';

import defaultTo from 'ember-osf-web/utils/default-to';

export enum ValidationStatus {
    Hidden,
    Success,
    HasError,
    HasWarning,
}

export default abstract class BaseValidatedInput<M extends DS.Model> extends Component {
    // Required arguments
    valuePath!: AttributesFor<M> | RelationshipsFor<M>;

    // Optional arguments
    changeset?: ChangesetDef & DS.Model;
    label?: string;
    ariaLabel?: string;
    placeholder?: string;
    disabled: boolean = defaultTo(this.disabled, false);
    shouldShowMessages: boolean = defaultTo(this.shouldShowMessages, true);
    model?: M;

    // Private properties
    @service i18n!: I18n;

    // defined in constructor
    errors?: string[];
    value: any;
    isInvalid?: boolean;
    isValidating?: boolean;
    validation?: ResultCollection;

    @computed('errors', 'validation.options')
    get isRequired(): boolean {
        if (!this.validation) {
            return false;
        }
        const { options } = this.validation;
        if (!options) {
            return false;
        }
        if (!options.presence) {
            return false;
        }
        if (options.presence.disabled) {
            return false;
        }
        if (options.presence.presence) {
            return true;
        }
        return false;
    }

    @computed('placeholder', 'isRequired')
    get _placeholder(): string {
        return this.placeholder || this.i18n.t(this.isRequired ? 'general.required' : 'general.optional');
    }

    @computed('shouldShowMessages', 'value', 'isInvalid', 'isValidating')
    get validationStatus(): ValidationStatus {
        const {
            shouldShowMessages,
            value,
            validation,
            isValidating,
            isInvalid,
        } = this;
        switch (true) {
        case !shouldShowMessages || isValidating:
            return ValidationStatus.Hidden;
        case isInvalid:
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
        if (this.changeset) {
            defineProperty(this, 'validation', oneWayMacro(`changeset.data.validations.attrs.${this.valuePath}`));
            defineProperty(this, 'errors', oneWayMacro(`changeset.error.${this.valuePath}.validation`));
            defineProperty(this, 'value', aliasMacro(`changeset.${this.valuePath}`));
            defineProperty(this, 'isValidating', oneWayMacro('changeset.isValidating'));
            defineProperty(this, 'isInvalid', boolMacro(`changeset.error.${this.valuePath}`));
        } else if (this.model) {
            defineProperty(this, 'validation', oneWayMacro(`model.validations.attrs.${this.valuePath}`));
            defineProperty(this, 'errors', oneWayMacro(`model.validations.attrs.${this.valuePath}.errors`));
            defineProperty(this, 'value', aliasMacro(`model.${this.valuePath}`));
            defineProperty(this, 'isValidating', oneWayMacro(`model.validations.attrs.${this.valuePath}.isValidating`));
            defineProperty(this, 'isInvalid', oneWayMacro(`model.validations.attrs.${this.valuePath}.isInvalid`));
        }
    }
}
