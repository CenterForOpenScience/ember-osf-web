import { attr } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';
import { Link } from 'jsonapi-typescript';

import { Document as ApiResponseDocument } from 'osf-api';

import getHref from 'ember-osf-web/utils/get-href';

import OsfModel, { OsfLinks } from './osf-model';

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

    // TODO (EMB-407) When the API is updated, remove this method and reset the secret
    // by PATCHing `clientSecret` to `null`
    async resetSecret(): Promise<void> {
        const resetUrl = getHref(this.links.reset);
        const adapter = this.store.adapterFor('developer-app');
        const serializer = this.store.serializerFor('developer-app');

        // @ts-ignore -- Private API
        const snapshot = this._createSnapshot();

        const response: ApiResponseDocument = await adapter.ajax(resetUrl, 'POST', {
            data: serializer.serialize(snapshot, {
                includeId: true,
                osf: {
                    includeCleanData: true,
                },
            }),
        });

        if ('data' in response && 'id' in response.data) {
            this.store.pushPayload('developer-app', response);
        } else if ('errors' in response) {
            throw new Error(response.errors.map(error => error.detail).join('\n'));
        } else {
            throw new Error('Unexpected response while resetting client secret for developer app');
        }
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'developer-app': DeveloperAppModel;
    } // eslint-disable-line semi
}
