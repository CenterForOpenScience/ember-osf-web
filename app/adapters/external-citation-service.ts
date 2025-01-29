import AddonServiceAdapter from './addon-service';

export default class ExternalCitationServiceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'external-citation-service': ExternalCitationServiceAdapter;
    } // eslint-disable-line semi
}
