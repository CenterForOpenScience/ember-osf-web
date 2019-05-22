import OsfAdapter from './osf-adapter';

export default class ExternalIdentityAdapter extends OsfAdapter {
    pathForType(_: string) {
        return 'users/me/settings/identities';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'external-identity': ExternalIdentityAdapter;
    } // eslint-disable-line semi
}
