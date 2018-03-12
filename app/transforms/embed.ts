import Transform from 'ember-data/transform';

export default Transform.extend({
    deserialize(serialized) {
        return serialized;
    },

    serialize(deserialized) {
        return deserialized;
    },
});

declare module 'ember-data' {
  interface TransformRegistry {
      'embed': any;
  }
}
