import OsfAdapter from './osf-adapter';

export default class AbstractNodeAdapter extends OsfAdapter {

}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'abstract-node': AbstractNodeAdapter;
    } // eslint-disable-line semi
}
