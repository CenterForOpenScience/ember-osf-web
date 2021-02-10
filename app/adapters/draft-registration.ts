import OsfAdapter from './osf-adapter';

export default class DraftRegistrationAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'draft-registration': DraftRegistrationAdapter;
    } // eslint-disable-line semi
}
