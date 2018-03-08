import OsfSerializer from './osf-serializer';

export default class Guid extends OsfSerializer.extend({
}) {}

declare module 'ember-data' {
  interface SerializerRegistry {
    'guid': Guid;
  }
}
