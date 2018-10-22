import OsfAdapter from './osf-adapter';

export default class Citation extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        citation: Citation;
    } // eslint-disable-line semi
}
