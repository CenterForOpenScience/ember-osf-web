import AddonServiceAdapter from './addon-service';

export default class AuthorizedCitationAccountAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'authorized-citation-account': AuthorizedCitationAccountAdapter;
    } // eslint-disable-line semi
}
