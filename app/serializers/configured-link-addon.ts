import ConfiguredAddonSerializer from './configured-addon';

export default class ConfiguredLinkAddonSerializer extends ConfiguredAddonSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-link-addon': ConfiguredLinkAddonSerializer;
    } // eslint-disable-line semi
}
