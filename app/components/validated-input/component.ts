// This component is derived from ember-cp-validations.
// See https://github.com/offirgolan/ember-cp-validations for more information
import Component from '@ember/component';
import { computed, defineProperty } from '@ember/object';
import { alias, and, not, notEmpty, oneWay } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';

enum InputType {
    Date = 'date',
    Password = 'password',
    Text = 'text',
    TextArea = 'textarea',
    ReCaptcha = 'reCaptcha',
}

export default class ValidatedInput extends Component.extend({
    classNames: ['validated-input'],
    classNameBindings: ['showErrorClass:has-error', 'isValid:has-success'],

    disabled: false,
    model: null,
    value: null,
    type: 'text',
    valuePath: '',
    placeholder: '',
    validation: null,
    isTyping: false,

    didValidate: oneWay('targetObject.didValidate'),
    isInvalid: oneWay('validation.isInvalid'),
    isValid: and('hasContent', 'validation.isValid', 'notValidating'),

    init(...args) {
        this._super(...args);
        const valuePath = this.get('valuePath');
        defineProperty(this, 'validation', oneWay(`model.validations.attrs.${valuePath}`));
        defineProperty(this, 'value', alias(`model.${valuePath}`));
    },

    actions: {
        forceParse(component) {
            component._forceParse();
        },

        onCaptchaResolved(reCaptchaResponse) {
            this.get('model').set(this.get('valuePath'), reCaptchaResponse);
        },

        onCaptchaExpired() {
            this.get('model').set(this.get('valuePath'), null);
        },
    },
}) {
    disabled: boolean;
    model: DS.Model;
    value: string;
    type: InputType;
    valuePath: string;
    placeholder: string;
    validation: any;
    isTyping: boolean;

    notValidating = not('validation.isValidating');
    hasContent = notEmpty('value');

    showErrorMessage = computed('validation.isDirty', 'isInvalid', 'didValidate', function(): boolean {
        return (this.get('validation.isDirty') || this.get('didValidate')) && this.get('isInvalid');
    });

    showWarningMessage = computed('validation.{isDirty,warnings.[]}', 'isValid', 'didValidate', function(): boolean {
        return (this.get('validation.isDirty') || this.get('didValidate'))
            && this.get('isValid')
            && !isEmpty(this.get('validation.warnings'));
    });
}
