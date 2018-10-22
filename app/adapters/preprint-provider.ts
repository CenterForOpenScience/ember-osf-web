import OsfAdapter from './osf-adapter';

export default class PreprintProvider extends OsfAdapter {
    pathForType(_: string): string {
        return 'providers/preprints';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'preprint-provider': PreprintProvider;
    } // eslint-disable-line semi
}
