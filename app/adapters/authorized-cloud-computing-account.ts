import AddonServiceAdapter from './addon-service';

export default class AuthorizedCloudComputingAccountAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'authorized-cloud-computing-account': AuthorizedCloudComputingAccountAdapter;
    } // eslint-disable-line semi
}
