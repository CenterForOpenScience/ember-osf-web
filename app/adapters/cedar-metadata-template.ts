import OsfAdapter from './osf-adapter';

export default class CedarMetadataTemplateAdapter extends OsfAdapter {
    namespace = '_';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'cedar-metadata-template': CedarMetadataTemplateAdapter;
    } // eslint-disable-line semi
}
