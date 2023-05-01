// This component is derived from ember-cp-validations.
// See https://github.com/offirgolan/ember-cp-validations for more information
import Model from '@ember-data/model';
import Component from '@ember/component';
import { computed, defineProperty } from '@ember/object';
import { dependentKeyCompat } from '@ember/object/compat';
import { alias, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { BufferedChangeset } from 'ember-changeset/types';

import { ResultCollection } from 'ember-cp-validations';
import { AttributesFor, RelationshipsFor } from 'ember-data';
import Intl from 'ember-intl/services/intl';

export enum ValidationStatus {
    Hidden,
    Success,
    HasError,
    HasWarning,
}

export default abstract class BaseValidatedInput<M extends Model> extends Component {
    // Required arguments
    valuePath!: AttributesFor<M> | RelationshipsFor<M>;

    // Optional arguments
    changeset?: BufferedChangeset & M;
    label?: string;
    ariaLabel?: string;
    placeholder?: string;
    disabled = false;
    shouldShowMessages = true;
    model?: M;
    isRequired?: Boolean;

    // Private properties
    @service intl!: Intl;

    // defined in constructor
    errors?: string[];
    value: any;
    isInvalid?: boolean;
    isValidating?: boolean;
    validation?: ResultCollection;

    @computed('errors', 'validation.options', 'isRequired')
    get required(): boolean {
        if (!this.validation) {
            return false;
        }
        if (this.isRequired === true) {
            return true;
        }
        if (this.isRequired === false) {
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

    @computed('placeholder', 'required')
    get _placeholder(): string {
        return this.placeholder || this.intl.t(this.required ? 'general.required' : 'general.optional');
    }

    @dependentKeyCompat
    get _isInvalid() {
        return this.changeset ? Boolean(this.changeset.error[this.valuePath as string]) : this.isInvalid;
    }

    @computed('shouldShowMessages', 'value', '_isInvalid', 'isInvalid', 'isValidating')
    get validationStatus(): ValidationStatus {
        const {
            shouldShowMessages,
            value,
            validation,
            _isValidating,
            _isInvalid,
        } = this;
        switch (true) {
        case !shouldShowMessages || _isValidating:
            return ValidationStatus.Hidden;
        case _isInvalid:
            return ValidationStatus.HasError;
        case validation && !isEmpty(validation.warnings):
            return ValidationStatus.HasWarning;
        case isEmpty(value):
            return ValidationStatus.Hidden;
        default:
            return ValidationStatus.Success;
        }
    }

    get _isValidating() {
        return this.changeset ? this.changeset.isValidating(this.valuePath as string) : this.isValidating;
    }

    init() {
        super.init();
        if (this.changeset) {
            defineProperty(this, 'validation', oneWay(`changeset.data.validations.attrs.${this.valuePath}`));
            defineProperty(this, 'errors', oneWay(`changeset.error.${this.valuePath}.validation`));
            defineProperty(this, 'value', alias(`changeset.${this.valuePath}`));
        } else if (this.model) {
            defineProperty(this, 'validation', oneWay(`model.validations.attrs.${this.valuePath}`));
            defineProperty(this, 'errors', oneWay(`model.validations.attrs.${this.valuePath}.errors`));
            defineProperty(this, 'value', alias(`model.${this.valuePath}`));
            defineProperty(this, 'isValidating', oneWay(`model.validations.attrs.${this.valuePath}.isValidating`));
            defineProperty(this, 'isInvalid', oneWay(`model.validations.attrs.${this.valuePath}.isInvalid`));
        }
    }
}
