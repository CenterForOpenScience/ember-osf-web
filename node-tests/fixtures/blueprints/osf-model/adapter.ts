import OsfAdapter from './osf-adapter';

export default class FooBarAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'foo-bar': FooBarAdapter;
    } // eslint-disable-line semi
}
