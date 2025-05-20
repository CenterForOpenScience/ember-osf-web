import AddonServiceAdapter from './addon-service';

export default class ExternalLinkServiceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'external-link-service': ExternalLinkServiceAdapter;
    } // eslint-disable-line semi
}
