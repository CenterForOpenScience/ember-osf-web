import AddonServiceAdapter from './addon-service';

export default class InternalUserAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'internal-user': InternalUserAdapter;
    } // eslint-disable-line semi
}
