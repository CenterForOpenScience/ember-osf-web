import OsfAdapter from './osf-adapter';

export default class ScopeAdapter extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'scope': ScopeAdapter;
    }
}
