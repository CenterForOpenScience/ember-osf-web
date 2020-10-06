import OsfAdapter from './osf-adapter';

export default class RegistrationRequestAdapter extends OsfAdapter {
    parentRelationship = 'provider';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'registration-request': RegistrationRequestAdapter;
    } // eslint-disable-line semi
}
