import OsfAdapter from './osf-adapter';

export default class Wiki extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'wiki': Wiki;
    }
}
