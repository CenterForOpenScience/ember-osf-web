import OsfAdapter from './osf-adapter';

export default class FileContentsAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'file-contents': FileContentsAdapter;
    } // eslint-disable-line semi
}
