import AddonServiceAdapter from './addon-service';

export default class ExternalRedirectServiceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'external-redirect-service': ExternalRedirectServiceAdapter;
    } // eslint-disable-line semi
}
