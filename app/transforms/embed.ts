import Transform from 'ember-data/transform';

export default class EmbedTransform extends Transform {
    deserialize(serialized: any) {
        return serialized;
    }

    serialize(deserialized: any) {
        return deserialized;
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        embed: any;
    } // eslint-disable-line semi
}
