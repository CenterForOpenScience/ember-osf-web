import OsfAdapter from './osf-adapter';

export default class FileContents extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'file-contents': FileContents;
    } // eslint-disable-line semi
}
