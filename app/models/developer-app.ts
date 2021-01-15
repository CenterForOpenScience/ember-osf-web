import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat, validateLength, validatePresence } from 'ember-changeset-validations/validators';
import DS from 'ember-data';
import { Link } from 'jsonapi-typescript';

import OsfModel, { OsfLinks } from './osf-model';

const { attr } = DS;

interface DeveloperAppValidations {
    name: string;
    description: string;
    homeUrl: string;
    callbackUrl: string;
}

export const developerAppValidations: ValidationObject<DeveloperAppValidations> = {
    name: [
        validatePresence({
            type: 'blank',
            presence: true,
            translationArgs: { description: 'Name' },
        }),
        validateLength({
            max: 200,
            type: 'tooLong',
            translationArgs: { description: 'Name' },
        }),
    ],
    description: [
        validateLength({
            max: 1000,
            type: 'tooLong',
            translationArgs: { description: 'Description' },
        }),
    ],
    homeUrl: [
        validateLength({
            max: 200,
            type: 'tooLong',
            translationArgs: { description: 'Homepage URL' },
        }),
        validatePresence({
            max: 200,
            presence: true,
            type: 'blank',
            translationArgs: { description: 'Homepage URL' },
        }),
        validateFormat({
            allowBlank: false,
            type: 'url',
            translationArgs: { description: 'Homepage URL' },
        }),
    ],
    callbackUrl: [
        validateLength({
            max: 200,
            type: 'tooLong',
            translationArgs: { description: 'Callback URL' },
        }),
        validatePresence({
            presence: true,
            max: 200,
            type: 'blank',
            translationArgs: { description: 'Callback URL' },
        }),
        validateFormat({
            allowBlank: false,
            type: 'url',
            regex: /^https:\/\//,
            translationArgs: { description: 'Callback URL' },
        }),
    ],
};

export interface DeveloperAppLinks extends OsfLinks {
    reset: Link;
}

export default class DeveloperAppModel extends OsfModel {
    @attr() links!: DeveloperAppLinks;
    @attr() callbackUrl!: string;
    @attr() clientId!: string;
    @attr() clientSecret!: string;
    @attr('date') dateCreated!: Date;
    @attr({ defaultValue: '' }) description!: string;
    @attr() homeUrl!: string;
    @attr() name!: string;
    @attr() owner!: string;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'developer-app': DeveloperAppModel;
    } // eslint-disable-line semi
}
