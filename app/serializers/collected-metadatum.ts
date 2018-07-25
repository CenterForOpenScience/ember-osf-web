import Osf from './osf-serializer';

export default class CollectedMetadatum extends Osf.extend({
    /**
     * Guid is an attribute on create
     */
    serialize(...args: any[]) {
        const serialized = this._super(...args);
        const { data, data: { attributes, relationships } } = serialized;

        data.type = 'collected-metadata';
        attributes.guid = relationships.guid.data.id;

        delete relationships.guid;

        return serialized;
    },
}) {
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'collected-metadatum': CollectedMetadatum;
    }
}
