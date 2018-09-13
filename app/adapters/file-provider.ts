import OsfAdapter from './osf-adapter';

export default class FileProvider extends OsfAdapter {
    pathForType(_: string): string {
        return 'files';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
      'file-provider': FileProvider;
    }
}
