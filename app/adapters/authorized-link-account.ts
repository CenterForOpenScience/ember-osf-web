import AddonServiceAdapter from './addon-service';

export default class AuthorizedLinkAccountAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'authorized-link-account': AuthorizedLinkAccountAdapter;
    } // eslint-disable-line semi
}
