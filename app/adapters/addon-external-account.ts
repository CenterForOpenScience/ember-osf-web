import AddonServiceAdapter from './addon-service';

export default class AddonExternalAccountAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'addon-external-account': AddonExternalAccountAdapter;
    } // eslint-disable-line semi
}
