import OsfAdapter from './osf-adapter';

export default class Metaschema extends OsfAdapter {
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'metaschema': Metaschema;
    }
}
