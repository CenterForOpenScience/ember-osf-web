import OsfAdapter from './osf-adapter';

export default class PreprintProviderAdapter extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/preprints';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'preprint-provider': PreprintProviderAdapter;
    } // eslint-disable-line semi
}
