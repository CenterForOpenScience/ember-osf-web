import AddonServiceAdapter from './addon-service';

export default class ConfiguredLinkAddonAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'configured-link-addon': ConfiguredLinkAddonAdapter;
    } // eslint-disable-line semi
}
