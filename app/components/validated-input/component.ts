// This component is derived from ember-cp-validations.
// See https://github.com/offirgolan/ember-cp-validations for more information
import { className, classNames } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { and, not, notEmpty, oneWay } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { computed as comp, defineProperty, get } from '@ember/object';
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
    valuePath: string = defaultTo(this.valuePath, '');
    placeholder: string = defaultTo(this.placeholder, '');
    validation: any = defaultTo(this.validation, null);
    isTyping: boolean = defaultTo(this.isTyping, false);

    @oneWay('targetObject.didValidate') didValidate;
    @oneWay('validation.isInvalid') isInvalid;
    @not('validation.isValidating') notValidating;
    @notEmpty('value') hasContent;

    @computed('validation.isDirty', 'isInvalid', 'didValidate')
    get showErrorMessage(this: ValidatedInput): boolean {
        return ((this.get('validation') && this.get('validation').get('isDirty')) || this.get('didValidate'))
            && this.get('isInvalid');
    }

    @computed('validation.{isDirty,warnings.[]}', 'isValid', 'didValidate')
    get showWarningMessage(this: ValidatedInput): boolean {
        return ((this.get('validation') && this.get('validation').get('isDirty')) || this.get('didValidate'))
            && this.get('isValid')
            && !isEmpty(this.get('validation').get('warnings'));
    }

    constructor() {
        super();
        const valuePath = get(this, 'valuePath');
        defineProperty(this, 'validation', comp.oneWay(`model.validations.attrs.${valuePath}`));
        defineProperty(this, 'value', comp.alias(`model.${valuePath}`));
    }

    @action
    forceParse(component) {
        component._forceParse();
    }

    @action
    onCaptchaResolved(this: ValidatedInput, reCaptchaResponse) {
        this.get('model').set(this.get('valuePath'), reCaptchaResponse);
    }

    @action
    onCaptchaExpired(this: ValidatedInput) {
        this.get('model').set(this.get('valuePath'), null);
    }
}
