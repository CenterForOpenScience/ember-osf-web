import OsfAdapter from './osf-adapter';

export default class FileProvider extends OsfAdapter {
    pathForType(_: string): string {
        return 'files';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
      'file-provider': FileProvider;
    } // eslint-disable-line semi
}
