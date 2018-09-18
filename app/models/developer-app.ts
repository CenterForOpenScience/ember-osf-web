import { attr } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';

import { Document as ApiResponseDocument } from 'osf-api';
import OsfModel from './osf-model';

const Validations = buildValidations({
    name: [
        validator('presence', true),
        validator('length', { min: 1, max: 200 }),
    ],
    homeUrl: [
        validator('presence', true),
        validator('length', { min: 1, max: 200 }),
        validator('format', { type: 'url' }),
    ],
    description: [
        validator('length', { min: 0, max: 1000 }),
    ],
    callbackUrl: [
        validator('presence', true),
        validator('length', { min: 1, max: 200 }),
        validator('format', { type: 'url' }),
    ],
});

export default class DeveloperAppModel extends OsfModel.extend(Validations) {
    @attr() callbackUrl!: string;
    @attr() clientId!: string;
    @attr() clientSecret!: string;
    @attr('date') dateCreated!: Date;
    @attr() description!: string;
    @attr() homeUrl!: string;
    @attr() name!: string; // eslint-disable-line no-restricted-globals
    @attr() owner!: string;

    async resetSecret(): Promise<void> {
        const resetUrl = this.links.reset;
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

declare module 'ember-data' {
    interface ModelRegistry {
        'developer-app': DeveloperAppModel;
    }
}
