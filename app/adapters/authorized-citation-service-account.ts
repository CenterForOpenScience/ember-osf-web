import AddonServiceAdapter from './addon-service';

export default class AuthorizedCitationServiceAccountAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'authorized-citation-service-account': AuthorizedCitationServiceAccountAdapter;
    } // eslint-disable-line semi
}
