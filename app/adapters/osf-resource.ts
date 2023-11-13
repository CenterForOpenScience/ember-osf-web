import AddonServiceAdapter from './addon-service';

export default class OsfResourceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'osf-resource': OsfResourceAdapter;
    } // eslint-disable-line semi
}
