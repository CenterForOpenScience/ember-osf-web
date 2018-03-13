import OsfAdapter from './osf-adapter';

export default class Guid extends OsfAdapter.extend({
    buildQuery(this: Guid): any {
        const query = this._super(...arguments) || {};
        query.resolve = false;
        return query;
    },
}) {}

declare module 'ember-data' {
  interface AdapterRegistry {
    'guid': Guid;
  }
}
