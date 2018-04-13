import { A, isArray } from '@ember/array';
import DS from 'ember-data';

const { Transform } = DS;

export default Transform.extend({
    deserialize(value) {
        return A(isArray(value) ? value : []);
    },
    serialize(value) {
        return A(isArray(value) ? value : []);
    },
});

declare module 'ember-data' {
    interface TransformRegistry {
        array: any[];
    }
}
