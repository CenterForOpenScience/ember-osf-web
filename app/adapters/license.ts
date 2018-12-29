import OsfAdapter from './osf-adapter';

export default class LicenseAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        license: LicenseAdapter;
    } // eslint-disable-line semi
}
