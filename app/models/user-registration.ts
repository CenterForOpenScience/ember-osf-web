import { attr } from '@ember-decorators/data';
import { computed } from '@ember/object';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

const { Model } = DS;

const Validations = buildValidations({
    email1: [
        validator('presence', true),
        validator('format', { type: 'email' }),
        validator('exclusion', {
            messageKey: 'validationErrors.email_registered',
            in: computed(function(): string[] {
                return [...this.get('model').get('existingEmails')];
            }).volatile(),
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
            max: 200,
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

export default class UserRegistration extends Model.extend(Validations) {
    @attr('string') email1!: string;
    @attr('string') email2!: string;
    @attr('string') fullName!: string;
    @attr('string') recaptchaResponse!: string;
    @attr('string') password!: string;
    @attr('boolean') acceptedTermsOfService!: boolean;

    existingEmails: Set<string> = new Set();

    addExistingEmail(this: UserRegistration, email?: string) {
        this.get('existingEmails').add(email || this.get('email1'));
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user-registration': UserRegistration;
    }
}
