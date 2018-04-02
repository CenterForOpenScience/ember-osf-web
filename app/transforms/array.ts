import { A, isArray } from '@ember/array';
import DS from 'ember-data';

const { Transform } = DS;

export default Transform.extend({
    deserialize(value) {
        if (isArray(value)) {
            return A(value as any[]);
        }
        return A();
    },
    serialize(value) {
        if (isArray(value)) {
            return A(value as any[]);
        }
        return A();
    },
});

declare module 'ember-data' {
  interface TransformRegistry {
      'array': any[];
  }
}
