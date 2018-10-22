import OsfAdapter from './osf-adapter';

export default class RegistrationSchema extends OsfAdapter {
    pathForType(_: string) {
        return 'schemas/registrations';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'registration-schema': RegistrationSchema;
    } // eslint-disable-line semi
}
