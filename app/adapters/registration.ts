import OsfAdapter from './osf-adapter';

export default class RegistrationAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        registration: RegistrationAdapter;
    } // eslint-disable-line semi
}
