import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

interface ModeratorAdapterOptions {
    providerId: string;
}

export default class ModeratorAdapter extends OsfAdapter {
    parentRelationship = 'provider';
    urlForFindRecord(id: string, _: string, snapshot: DS.Snapshot): string {
        const adapterOptions = snapshot.adapterOptions as ModeratorAdapterOptions;
        const { providerId } = adapterOptions;
        return `${this.urlPrefix()}/providers/registrations/${providerId}/moderators/${id}`;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        moderator: ModeratorAdapter;
    } // eslint-disable-line semi
}
