import { attr, belongsTo } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import UserModel from './user';

const { Model } = DS;

const Validations = buildValidations({
    existingPassword: [
        validator('presence', true),
    ],
    newPassword: [
        validator('presence', true),
        validator('length', {
            max: 255,
            min: 8,
        }),
        validator('password-strength', {
            min: 2,
        }),
        validator('mismatch', {
            messageKey: 'validationErrors.password_old',
            on: 'existingPassword',
        }),
    ],
    confirmPassword: [
        validator('presence', true),
        validator('confirmation', {
            messageKey: 'validationErrors.password_match',
            on: 'newPassword',
        }),
    ],
}, {
    debounce: 500,
});

export default class UserPasswordModel extends Model.extend(Validations) {
    @attr('string') existingPassword!: string;
    @attr('string') newPassword!: string;
    @attr('string') confirmPassword!: string;

    @belongsTo('user')
    user!: UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-password': UserPasswordModel;
    } // eslint-disable-line semi
}
