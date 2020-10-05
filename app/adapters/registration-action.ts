import OsfAdapter from './osf-adapter';

export default class RegistrationActionAdapter extends OsfAdapter {
    parentRelationship = 'provider';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'registration-action': RegistrationActionAdapter;
    } // eslint-disable-line semi
}
