import OsfAdapter from './osf-adapter';

export default class FileContents extends OsfAdapter {
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'file-contents': FileContents;
    }
}
