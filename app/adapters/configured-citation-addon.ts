import AddonServiceAdapter from './addon-service';

export default class ConfiguredCitationAddonAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'configured-citation-addon': ConfiguredCitationAddonAdapter;
    } // eslint-disable-line semi
}
