import OsfAdapter from './osf-adapter';

export default class ModeratorAdapter extends OsfAdapter {
    parentRelationship = 'provider';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        moderator: ModeratorAdapter;
    } // eslint-disable-line semi
}
