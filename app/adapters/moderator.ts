import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

interface ModeratorAdapterOptions {
    providerId: string;
    providerType: 'registrations' | 'collections';
}

export default class ModeratorAdapter extends OsfAdapter {
    parentRelationship = 'provider';
    urlForFindRecord(id: string, _: string | number, snapshot: DS.Snapshot): string {
        const adapterOptions = snapshot.adapterOptions as ModeratorAdapterOptions;
        const { providerId, providerType } = adapterOptions;
        return `${this.urlPrefix()}/providers/${providerType}/${providerId}/moderators/${id}`;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        moderator: ModeratorAdapter;
    } // eslint-disable-line semi
}
