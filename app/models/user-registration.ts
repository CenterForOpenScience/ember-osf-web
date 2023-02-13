import { alias } from '@ember/object/computed';
import Model, { attr } from '@ember-data/model';
import { buildValidations, validator } from 'ember-cp-validations';
import config from 'ember-get-config';

const { support: { supportEmail } } = config;

const Validations = buildValidations({
    email1: [
        validator('presence', true),
        validator('format', { type: 'email' }),
        validator('exclusion', {
            messageKey: 'validationErrors.email_registered',
            in: alias('model.existingEmailsArray'),
        }),
        validator('exclusion', {
            messageKey: 'validationErrors.email_invalid',
            supportEmail,
            in: alias('model.invalidEmailsArray'),
        }),
        validator('length', {
            max: 255,
        }),
    ],
    email2: [
        validator('presence', true),
        validator('confirmation', {
            messageKey: 'validationErrors.email_match',
            on: 'email1',
        }),
    ],
    fullName: [
        validator('presence', true),
        validator('length', {
            max: 186,
            min: 3,
        }),
    ],
    recaptchaResponse: [
        validator('presence', {
            presence: true,
            messageKey: 'validationErrors.recaptcha',
        }),
    ],
    password: [
        validator('presence', true),
        validator('length', {
            max: 255,
            min: 8,
        }),
        validator('mismatch', {
            messageKey: 'validationErrors.password_email',
            on: 'email1',
        }),
        validator('password-strength', {
            min: 2,
        }),
    ],
    acceptedTermsOfService: [
        validator('affirmation', {
            messageKey: 'affirm_terms',
        }),
    ],
}, {
    debounce: 500,
});

export default class UserRegistrationModel extends Model.extend(Validations) {
    @attr('string') email1!: string;
    @attr('string') email2!: string;
    @attr('string') fullName!: string;
    @attr('string') recaptchaResponse!: string;
    @attr('string') password!: string;
    @attr('boolean') acceptedTermsOfService!: boolean;
    @attr('string') campaign!: string;

    existingEmails: Set<string> = new Set();
    invalidEmails: Set<string> = new Set();

    get existingEmailsArray(): string[] {
        return [...this.existingEmails];
    }

    get invalidEmailsArray(): string[] {
        return [...this.invalidEmails];
    }

    addExistingEmail(email?: string) {
        this.existingEmails.add(email || this.email1);
    }

    addInvalidEmail(email?: string) {
        this.invalidEmails.add(email || this.email1);
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-registration': UserRegistrationModel;
    } // eslint-disable-line semi
}
