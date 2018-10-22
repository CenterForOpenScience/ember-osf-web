import Transform from 'ember-data/transform';

export default Transform.extend({
    deserialize(serialized: any) {
        return serialized;
    },
    serialize(deserialized: any) {
        return deserialized;
    },
});

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        links: any;
    } // eslint-disable-line semi
}
