import OsfAdapter from './osf-adapter';

export default class Wiki extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        wiki: Wiki;
    } // eslint-disable-line semi
}
