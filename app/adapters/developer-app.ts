import OsfAdapter from './osf-adapter';

export default class DeveloperAppAdapter extends OsfAdapter {
    pathForType(_: string) {
        return 'applications';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'developer-app': DeveloperAppAdapter;
    } // eslint-disable-line semi
}
