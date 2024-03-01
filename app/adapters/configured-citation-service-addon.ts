import AddonServiceAdapter from './addon-service';

export default class ConfiguredCitationServiceAddonAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'configured-citation-service-addon': ConfiguredCitationServiceAddonAdapter;
    } // eslint-disable-line semi
}
