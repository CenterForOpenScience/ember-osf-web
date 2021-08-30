import DS from 'ember-data';

const { StringTransform } = DS;

/**
 * Custom string transform that maps an empty string to 'uncategorized' and vice versa.
 * Uncategorized nodes have `category: ''` or `category: null` in the API.
 * ```
 */
export default class NodeCategoryTransform extends StringTransform {
    deserialize(serialized: string, options: DS.AttrOptions<string>) {
        return super.deserialize(serialized || 'uncategorized', options);
    }

    serialize(deserialized: string, options: DS.AttrOptions<string>) {
        return super.serialize(deserialized === 'uncategorized' ? '' : deserialized, options);
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'node-category': string;
    } // eslint-disable-line semi
}
