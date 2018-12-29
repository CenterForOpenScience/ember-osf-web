import DS from 'ember-data';

import OsfAdapter from './osf-adapter';

export default class GuidAdapter extends OsfAdapter {
    buildQuery(snapshot: DS.Snapshot): object {
        return {
            ...(super.buildQuery(snapshot) || {}),
            resolve: false,
        };
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        guid: GuidAdapter;
    } // eslint-disable-line semi
}
