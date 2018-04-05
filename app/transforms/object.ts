import DS from 'ember-data';
import $ from 'jquery';

const { Transform } = DS;

export default Transform.extend({
    deserialize(value) {
        if ($.isPlainObject(value)) {
            return value;
        }
        return {};
    },

    serialize(value) {
        if ($.isPlainObject(value)) {
            return value;
        }
        return {};
    },
});

declare module 'ember-data' {
  interface TransformRegistry {
      'object': any;
  }
}
