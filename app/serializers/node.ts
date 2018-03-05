import OsfSerializer from './osf-serializer';

export default class Node extends OsfSerializer {
    relationshipTypes = {
        license: 'licenses',
    };
}


declare module 'ember-data' {
    interface SerializerRegistry {
        'node': Node;
    }
}
