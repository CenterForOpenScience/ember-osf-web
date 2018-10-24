import { attr, belongsTo } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import OsfModel from './osf-model';
import User from './user';

const Validations = buildValidations({
    emailAddress: [
        validator('presence', true),
        validator('format', { type: 'email' }),
        validator('length', {
            max: 255,
        }),
    ],
}, {
    debounce: 500,
});

export default class UserEmailModel extends OsfModel.extend(Validations) {
    @attr() emailAddress!: string;
    @attr('boolean') confirmed!: boolean;
    @alias('confirmed') isConfirmed!: boolean;
    @attr('boolean') verified!: boolean;
    @attr('boolean') primary!: boolean;
    @alias('primary') isPrimary!: boolean;
    @attr('boolean') isMerge!: boolean;

    @belongsTo('user', { inverse: 'emails' }) user!: DS.PromiseObject<User> & User;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'user-email': UserEmailModel;
    }
}
