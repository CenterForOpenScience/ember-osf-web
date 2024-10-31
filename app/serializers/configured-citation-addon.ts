import DS from 'ember-data';
import { SingleResourceDocument } from 'osf-api';

import GravyValetSerializer from './gravy-valet-serializer';

export default class ConfiguredCitationAddonSerializer extends GravyValetSerializer {
    serialize(snapshot: DS.Snapshot, options: {}) {
        const serialized = super.serialize(snapshot, options) as SingleResourceDocument;
        if (!serialized.data.attributes!.authorized_resource_uri) {
            delete serialized.data.attributes!.authorized_resource_uri;
        }
        return serialized;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'configured-citation-addon': ConfiguredCitationAddonSerializer;
    } // eslint-disable-line semi
}
