import OsfAdapter from './osf-adapter';

export default class Registration extends OsfAdapter {
    pathForType() {
        return 'registrations';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'registration': Registration;
    }
}
