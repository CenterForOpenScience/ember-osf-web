import OsfAdapter from './osf-adapter';

export default class Citation extends OsfAdapter {
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'citation': Citation;
    }
}
