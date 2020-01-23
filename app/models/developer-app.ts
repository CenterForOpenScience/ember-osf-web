import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import { Link } from 'jsonapi-typescript';

import OsfModel, { OsfLinks } from './osf-model';

const { attr } = DS;

const Validations = buildValidations({
    name: [
        validator('presence', true),
        validator('length', { min: 1, max: 200 }),
    ],
    homeUrl: [
        validator('presence', true),
        validator('length', { min: 1, max: 200 }),
        validator('httpUrl'),
    ],
    description: [
        validator('length', { min: 0, max: 1000 }),
    ],
    callbackUrl: [
        validator('presence', true),
        validator('length', { min: 1, max: 200 }),
        validator('httpUrl', { requireHttps: true }),
    ],
});

export interface DeveloperAppLinks extends OsfLinks {
    reset: Link;
}

export default class DeveloperAppModel extends OsfModel.extend(Validations) {
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
