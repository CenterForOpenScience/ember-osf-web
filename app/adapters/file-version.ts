import OsfAdapter from './osf-adapter';

export default class FileVersionAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'file-version': FileVersionAdapter;
    } // eslint-disable-line semi
}
