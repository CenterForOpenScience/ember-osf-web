import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import config from 'ember-get-config';
import { Link } from 'jsonapi-typescript';

import OsfModel, { OsfLinks } from './osf-model';
import UserModel from './user';

const { attr, belongsTo } = DS;

const { support: { supportEmail } } = config;

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
                return [...this.model.existingEmails];
            // eslint-disable-next-line ember/no-volatile-computed-properties
            }).volatile(),
        }),
        validator('exclusion', {
            messageKey: 'validationErrors.email_invalid',
            supportEmail,
            in: computed(function(): string[] {
                return [...this.model.invalidEmails];
            // eslint-disable-next-line ember/no-volatile-computed-properties
            }).volatile(),
        }),
    ],
});

export interface UserEmailLinks extends OsfLinks {
    resend_confirmation: Link; // eslint-disable-line camelcase
}

export default class UserEmailModel extends OsfModel.extend(Validations) {
    @attr() links!: UserEmailLinks;
    @attr() emailAddress!: string;
    @attr('boolean') confirmed!: boolean;
    @alias('confirmed') isConfirmed!: boolean;
    @attr('boolean') verified!: boolean;
    @attr('boolean') primary!: boolean;
    @alias('primary') isPrimary!: boolean;
    @attr('boolean') isMerge!: boolean;

    @belongsTo('user', {
        inverse: 'emails',
    }) user!: DS.PromiseObject<UserModel> & UserModel;

    existingEmails: Set<string> = new Set();
    invalidEmails: Set<string> = new Set();
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'user-email': UserEmailModel;
    } // eslint-disable-line semi
}
