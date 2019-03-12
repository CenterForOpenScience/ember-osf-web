import { camelize, underscore } from '@ember/string';
import ModelRegistry from 'ember-data/types/registries/model';
import { pluralize, singularize } from 'ember-inflector';
import { Links } from 'jsonapi-typescript';

import { Resource } from 'osf-api';

// Automatic type safety for attributes and relationships appears prohibitively expensive.
// Instead, use `unknown` to force explicit types.
export type SparseModel = {
    id: string | number;
    modelName: string;
    links?: Links;
} & Record<string, unknown>;

export type SparseFieldset = {
    [K in keyof ModelRegistry]?: string[]
};

function mapKeysAndValues<Value, NewValue>(
    obj: Record<string, Value>,
    mapKey: (k: string) => string,
    mapValue: (v: Value) => NewValue,
): Record<string, NewValue> {
    return Object.entries(obj).reduce(
        (acc, [k, v]) => ({
            ...acc,
            [mapKey(k)]: mapValue(v),
        }),
        {} as Record<string, NewValue>,
    );
}

export function parseSparseResource(resource: Resource): SparseModel {
    const {
        id,
        type,
        attributes,
        embeds,
        links,
    } = resource;

    const mappedAttributes = mapKeysAndValues(
        attributes || {},
        key => camelize(key),
        value => value,
    );

    const mappedEmbeds = mapKeysAndValues(
        embeds || {},
        key => camelize(key),
        value => (value.data instanceof Array ?
            value.data.map(embeddedDoc => parseSparseResource(embeddedDoc)) :
            parseSparseResource(value.data)),
    );

    return {
        id,
        modelName: singularize(camelize(type)),
        ...(links ? { links } : {}),
        ...mappedAttributes,
        ...mappedEmbeds,
    };
}

export function buildFieldsParam(fieldset: SparseFieldset) {
    return mapKeysAndValues(
        fieldset,
        key => underscore(pluralize(key)),
        value => value!.map(
            v => underscore(v),
        ).sort().join(','),
    );
}
