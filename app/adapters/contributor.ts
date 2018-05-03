import OsfAdapter from './osf-adapter';

export default class Contributor extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'contributor': Contributor;
    }
}
