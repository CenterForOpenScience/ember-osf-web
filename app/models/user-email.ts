import { attr, belongsTo } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { computed } from '@ember/object';
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
        validator('exclusion', {
            messageKey: 'validationErrors.email_duplicate',
            in: computed(function(): string[] {
                return [...this.get('model').get('existingEmails')];
            }).volatile(),
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

    existingEmails: Set<string> = new Set();

    addExistingEmail(this: UserEmailModel, email?: string) {
        this.get('existingEmails').add(email || this.get('emailAddress'));
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-email': UserEmailModel;
    } // eslint-disable-line semi
}
