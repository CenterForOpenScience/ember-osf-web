import DS from 'ember-data';
import { SingleResourceDocument } from 'osf-api';

import GravyValetSerializer from './gravy-valet-serializer';

export default class ConfiguredAddonSerializer extends GravyValetSerializer {
    serialize(snapshot: DS.Snapshot, options: {}) {
        const serialized = super.serialize(snapshot, options) as SingleResourceDocument;
        if (!serialized.data.attributes!.authorized_resource_uri) {
            delete serialized.data.attributes!.authorized_resource_uri;
        }
        return serialized;
    }
}
