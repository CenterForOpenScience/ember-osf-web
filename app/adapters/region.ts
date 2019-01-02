import OsfAdapter from './osf-adapter';

export default class RegionAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        region: RegionAdapter;
    } // eslint-disable-line semi
}
