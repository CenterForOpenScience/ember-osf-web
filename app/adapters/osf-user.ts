import AddonServiceAdapter from './addon-service';

export default class OsfUserAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'osf-user': OsfUserAdapter;
    } // eslint-disable-line semi
}
