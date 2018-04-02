import DS from 'ember-data';
import $ from 'jquery';

export default DS.Transform.extend({
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
