import OsfAdapter from './osf-adapter';

export default class FileProviderAdapter extends OsfAdapter {
    pathForType(_: string): string {
        return 'files';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
      'file-provider': FileProviderAdapter;
    } // eslint-disable-line semi
}
