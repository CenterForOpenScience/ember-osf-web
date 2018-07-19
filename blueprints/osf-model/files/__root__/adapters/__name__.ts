import OsfAdapter from './osf-adapter';

export default class <%= classifiedModuleName %>Adapter extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        '<%= dasherizedModuleName %>': <%= classifiedModuleName %>Adapter;
    }
}
