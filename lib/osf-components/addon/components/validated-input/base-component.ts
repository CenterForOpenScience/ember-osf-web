// This component is derived from ember-cp-validations.
// See https://github.com/offirgolan/ember-cp-validations for more information
import { className } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { and, not, notEmpty } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { defineProperty } from '@ember/object';
import { alias as aliasMacro, oneWay as oneWayMacro } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import defaultTo from 'ember-osf-web/utils/default-to';

export default abstract class BaseValidatedInput extends Component {
    // Required arguments
    model!: DS.Model;
    valuePath!: string;

    // Optional arguments
    ariaLabel?: string;
    placeholder?: string;
    disabled: boolean = defaultTo(this.disabled, false);

    // Private properties
    validation?: any; // defined in constructor
    value?: string; // defined in constructor

    @and('validation.{isDirty,isInvalid}') showErrorMessage!: boolean;
    @notEmpty('value') hasContent!: boolean;
    @not('validation.isValidating') notValidating!: boolean;

    @className('has-success')
    @and('hasContent', 'validation.isValid', 'notValidating')
    isValid!: boolean;

    // TODO delete?
    @className('has-error')
    showErrorClass!: boolean;

    @computed('validation.{isDirty,warnings.[]}', 'isValid')
    get showWarningMessage(): boolean {
        return this.validation
            && this.validation.isDirty
            && this.isValid
            && !isEmpty(this.validation.warnings);
    }

    @computed('elementId', 'valuePath')
    get inputElementId() {
        return `${this.elementId}__${this.valuePath}`;
    }

    constructor(...args: any[]) {
        super(...args);

        defineProperty(this, 'validation', oneWayMacro(`model.validations.attrs.${this.valuePath}`));
        defineProperty(this, 'value', aliasMacro(`model.${this.valuePath}`));
    }
}
