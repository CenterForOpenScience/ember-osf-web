import OsfAdapter from './osf-adapter';

export default class PreprintProvider extends OsfAdapter {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'preprint-provider': PreprintProvider;
    }
}
