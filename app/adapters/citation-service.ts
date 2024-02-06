import AddonServiceAdapter from './addon-service';

export default class CitationServiceAdapter extends AddonServiceAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'citation-service': CitationServiceAdapter;
    } // eslint-disable-line semi
}
