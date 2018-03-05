import OsfAdapter from './osf-adapter';

export default class Taxonomy extends OsfAdapter {
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'taxonomy': Taxonomy;
    }
}
