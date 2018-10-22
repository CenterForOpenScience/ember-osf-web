import OsfAdapter from './osf-adapter';

export default class Guid extends OsfAdapter.extend({
    buildQuery(this: Guid, ...args: any[]): object {
        return {
            ...(this._super(...args) || {}),
            resolve: false,
        };
    },
}) {}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        guid: Guid;
    } // eslint-disable-line semi
}
