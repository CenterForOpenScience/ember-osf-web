import OsfAdapter from './osf-adapter';

export default class FileVersion extends OsfAdapter {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'file-version': FileVersion;
    }
}
