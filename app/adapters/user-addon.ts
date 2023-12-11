import OsfAdapter from './osf-adapter';

export default class UserAddonAdapter extends OsfAdapter {
    parentRelationship = 'user';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-addon': UserAddonAdapter;
    } // eslint-disable-line semi
}
