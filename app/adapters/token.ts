import OsfAdapter from './osf-adapter';

export default class TokenAdapter extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'token': TokenAdapter;
    }
}
