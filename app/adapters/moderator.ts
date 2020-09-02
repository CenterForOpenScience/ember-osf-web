import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class ModeratorAdapter extends OsfAdapter {
    parentRelationship = 'provider';

    urlForUpdateRecord(id: string, modelName: string, snapshot: DS.Snapshot): string {
        // @ts-ignore
        const { provider } = snapshot.adapterOptions;
        if (provider && provider.links) {
            return [
                provider.links.self,
                `moderators/${id}`,
            ].join('');
        }
        return super.urlForUpdateRecord(id, modelName, snapshot);
    }

    urlForDeleteRecord(id: string, modelName: string, snapshot: DS.Snapshot): string {
        // @ts-ignore
        const { provider } = snapshot.adapterOptions;
        if (provider && provider.links) {
            return [
                provider.links.self,
                `moderators/${id}`,
            ].join('');
        }
        return super.urlForDeleteRecord(id, modelName, snapshot);
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        moderator: ModeratorAdapter;
    } // eslint-disable-line semi
}
