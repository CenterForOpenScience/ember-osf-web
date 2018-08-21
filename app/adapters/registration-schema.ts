import OsfAdapter from './osf-adapter';

export default class RegistrationSchema extends OsfAdapter {
    pathForType() {
        return 'schemas/registrations';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'registration-schema': RegistrationSchema;
    }
}
