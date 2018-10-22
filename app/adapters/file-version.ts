import OsfAdapter from './osf-adapter';

export default class FileVersion extends OsfAdapter {}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'file-version': FileVersion;
    } // eslint-disable-line semi
}
