import { attr, belongsTo } from '@ember-decorators/data';
import { alias } from '@ember-decorators/object/computed';
import { computed } from '@ember/object';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import config from 'ember-get-config';
import { Link } from 'jsonapi-typescript';

import OsfModel, { OsfLinks } from './osf-model';
import UserModel from './user';

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
            }).volatile(),
        }),
        validator('exclusion', {
            messageKey: 'validationErrors.email_invalid',
            supportEmail,
            in: computed(function(): string[] {
                return [...this.model.invalidEmails];
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
