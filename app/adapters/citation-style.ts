import OsfAdapter from './osf-adapter';

export default class CitationStyleAdapter extends OsfAdapter {
    pathForType(_: string): string {
        return 'citations/styles';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'citation-style': CitationStyleAdapter;
    } // eslint-disable-line semi
}
