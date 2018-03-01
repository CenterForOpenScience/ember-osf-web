import OsfAdapter from './osf-adapter';

export default class FileProvider extends OsfAdapter {
    pathForType = function(): string {
        return 'files';
    };
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
    interface AdapterRegistry {
      'file-provider': FileProvider;
    }
}
