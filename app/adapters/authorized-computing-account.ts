import AddonServiceAdapter from './addon-service';

export default class AuthorizedComputingAccountAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'authorized-computing-account': AuthorizedComputingAccountAdapter;
    } // eslint-disable-line semi
}
