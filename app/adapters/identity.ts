import OsfAdapter from './osf-adapter';

export default class IdentityAdapter extends OsfAdapter {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'identity': IdentityAdapter;
    }
}
