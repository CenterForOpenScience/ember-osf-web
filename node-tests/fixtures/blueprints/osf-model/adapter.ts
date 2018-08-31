import OsfAdapter from './osf-adapter';

export default class FooBarAdapter extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'foo-bar': FooBarAdapter;
    }
}
