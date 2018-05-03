import OsfAdapter from './osf-adapter';

export default class Registration extends OsfAdapter {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'registration': Registration;
    }
}
