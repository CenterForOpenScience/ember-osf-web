import OsfAdapter from './osf-adapter';

export default class License extends OsfAdapter {
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'license': License;
    }
}
