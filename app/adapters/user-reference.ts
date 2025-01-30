import AddonServiceAdapter from './addon-service';

export default class UserReferenceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-reference': UserReferenceAdapter;
    } // eslint-disable-line semi
}
