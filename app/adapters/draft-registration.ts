import OsfAdapter from './osf-adapter';

export default class DraftRegistration extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'draft-registration': DraftRegistration;
    }
}
