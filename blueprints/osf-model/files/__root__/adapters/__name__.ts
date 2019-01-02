import OsfAdapter from './osf-adapter';

export default class <%= classifiedModuleName %>Adapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        '<%= dasherizedModuleName %>': <%= classifiedModuleName %>Adapter;
    } // eslint-disable-line semi
}
