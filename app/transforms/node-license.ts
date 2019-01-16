import EmberObject from '@ember/object';
import { camelize, decamelize } from '@ember/string';
import DS from 'ember-data';

interface Serialized extends EmberObject {
    copyright_holders?: string[]; // eslint-disable-line camelcase
    year?: string;
}

export interface Deserialized extends EmberObject {
    copyrightHolders?: string;
    year?: string;
}

function rekeyObject<T>(fn: (str: string) => string, object: T, recursive?: boolean): EmberObject {
    const obj = Object.entries(object)
        .reduce((acc, [key, val]) => ({
            ...acc,
            [fn(key)]: recursive && typeof val === 'object' ?
                rekeyObject(fn, val, recursive) :
                val,
        }), {});

    return EmberObject.create(obj);
}

function camelizeObject<T>(object: T, recursive?: boolean): EmberObject {
    return rekeyObject(camelize, object, recursive);
}

function decamelizeObject<T>(object: T, recursive?: boolean): EmberObject {
    return rekeyObject(decamelize, object, recursive);
}

export default class NodeLicense extends DS.Transform {
    deserialize(value: Serialized): Deserialized {
        if (!value) {
            return EmberObject.create({});
        }

        const {
            copyright_holders = [], // eslint-disable-line camelcase
            year = '',
        } = value;

        return camelizeObject({
            copyright_holders: copyright_holders.join(', '),
            year,
        });
    }

    serialize(value: Deserialized): Serialized {
        if (!value) {
            return EmberObject.create({});
        }

        const {
            copyrightHolders = '',
            year = '',
        } = value;

        return EmberObject.create(decamelizeObject({
            copyrightHolders: copyrightHolders
                .split(', ')
                .map(s => s.trim()),
            year,
        }));
    }
}

declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
        'node-license': NodeLicense;
    } // eslint-disable-line semi
}
