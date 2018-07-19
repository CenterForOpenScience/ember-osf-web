import OsfAdapter from './osf-adapter';

export default class RegistrationMetaschema extends OsfAdapter {
    pathForType() {
        return 'metaschemas/registrations';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'registration-metaschema': RegistrationMetaschema;
    }
}
