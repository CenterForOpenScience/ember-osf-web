// This component is derived from ember-cp-validations.
// See https://github.com/offirgolan/ember-cp-validations for more information
import { className, classNames } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { and, not, notEmpty, oneWay } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { computed as comp, defineProperty } from '@ember/object';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import defaultTo from 'ember-osf-web/utils/default-to';

enum InputType {
    Date = 'date',
    Password = 'password',
    Text = 'text',
    TextArea = 'textarea',
    ReCaptcha = 'reCaptcha',
}

@classNames('validated-input')
export default class ValidatedInput extends Component {
    @className('has-success')
    @and('hasContent', 'validation.isValid', 'notValidating') isValid;

    @className('has-error') showErrorClass;

    model: DS.Model;
    disabled: boolean = defaultTo(this.disabled, false);
    value: string = defaultTo(this.value, '');
    type: InputType = defaultTo(this.type, InputType.Text);
    valuePath: keyof DS.Model = defaultTo(this.valuePath, '');
    placeholder: string = defaultTo(this.placeholder, '');
    validation: any = defaultTo(this.validation, null);
    isTyping: boolean = defaultTo(this.isTyping, false);

    @oneWay('targetObject.didValidate') didValidate;
    @oneWay('validation.isInvalid') isInvalid;
    @not('validation.isValidating') notValidating;
    @notEmpty('value') hasContent;

    @computed('validation.isDirty', 'isInvalid', 'didValidate')
    get showErrorMessage(): boolean {
        return ((this.validation && this.validation.isDirty) || this.didValidate)
            && this.isInvalid;
    }

    @computed('validation.{isDirty,warnings.[]}', 'isValid', 'didValidate')
    get showWarningMessage(): boolean {
        return ((this.validation && this.validation.isDirty) || this.didValidate)
            && this.isValid
            && !isEmpty(this.validation.warnings);
    }

    constructor(properties: object) {
        super(properties);
        defineProperty(this, 'validation', comp.oneWay(`model.validations.attrs.${this.valuePath}`));
        defineProperty(this, 'value', comp.alias(`model.${this.valuePath}`));
    }

    @action
    forceParse(component) {
        component._forceParse();
    }

    @action
    onCaptchaResolved(this: ValidatedInput, reCaptchaResponse) {
        this.model.set(this.valuePath, reCaptchaResponse);
    }

    @action
    onCaptchaExpired(this: ValidatedInput) {
        this.model.set(this.valuePath, '');
    }
}
