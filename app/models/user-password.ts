import { attr, belongsTo } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import UserModel from './user';

const { Model } = DS;

const Validations = buildValidations({
    currentPassword: [
        validator('presence', true),
    ],
    password: [
        validator('presence', true),
        validator('length', {
            max: 255,
            min: 8,
        }),
        validator('password-strength', {
            min: 2,
        }),
        validator('mismatch', {
            on: 'currentPassword',
            message: 'New password must not match current password',
        }),
    ],
    confirmPassword: [
        validator('presence', true),
        validator('confirmation', {
            on: 'password',
            message: 'Passwords must match',
        }),
    ],
}, {
    debounce: 500,
});

export default class UserPasswordModel extends Model.extend(Validations) {
    @attr('string') currentPassword!: string;
    @attr('string') password!: string;
    @attr('string') confirmPassword!: string;

    @belongsTo('user')
    user!: UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-password': UserPasswordModel;
    } // eslint-disable-line semi
}
