import OsfAdapter from './osf-adapter';

export default class FileProvider extends OsfAdapter {
    pathForType = function(): string {
        return 'files';
    };
}


declare module 'ember-data' {
    interface AdapterRegistry {
      'file-provider': FileProvider;
    }
}
