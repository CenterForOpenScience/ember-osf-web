import OsfAdapter from './osf-adapter';

export default class AddonAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        addon: AddonAdapter;
    } // eslint-disable-line semi
}
