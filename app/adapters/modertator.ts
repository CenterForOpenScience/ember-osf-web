// import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class ModeratorAdapter extends OsfAdapter {
    parentRelationship = 'provider';
    // urlForUpdateRecord
    // urlForDeleteRecord
    //     return `${this.urlPrefix()}/providers/registrations/${providerId}/moderators`;
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        moderator: ModeratorAdapter;
    } // eslint-disable-line semi
}
