import OsfAdapter from './osf-adapter';

export default class ResourceAdapter extends OsfAdapter {

}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        resource: ResourceAdapter;
    } // eslint-disable-line semi
}
