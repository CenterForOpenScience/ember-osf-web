import OsfAdapter from './osf-adapter';

export default class CedarMetadataTemplateAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'cedar-metadta-template': CedarMetadataTemplateAdapter;
    } // eslint-disable-line semi
}
