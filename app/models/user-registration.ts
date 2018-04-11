import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

const { attr, Model } = DS;

const Validations = buildValidations({
    email1: [
        validator('presence', true),
        validator('format', { type: 'email' }),
        validator('exclusion', {
            messageKey: 'validationErrors.email_registered',
            in: [],
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
            max: 255,
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
}, {
    debounce: 500,
});

export default class UserRegistration extends Model.extend(Validations, {
    email1: attr('string'),
    email2: attr('string'),
    fullName: attr('string'),
    recaptchaResponse: attr('string'),
    password: attr('string'),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
        'user-registration': UserRegistration;
    }
}
