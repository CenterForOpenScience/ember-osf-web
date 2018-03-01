import OsfSerializer from './osf-serializer';

export default class Node extends OsfSerializer {
    relationshipTypes = {
        license: 'licenses',
    };
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data' {
    interface SerializerRegistry {
        'node': Node;
    }
}
