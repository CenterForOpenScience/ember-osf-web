import OsfAdapter from './osf-adapter';

export default class AddonExternalAccountAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'addon-external-account': AddonExternalAccountAdapter;
    } // eslint-disable-line semi
}
