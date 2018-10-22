import OsfAdapter from './osf-adapter';

export default class Registration extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        registration: Registration;
    } // eslint-disable-line semi
}
