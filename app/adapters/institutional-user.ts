import OsfAdapter from './osf-adapter';

export default class InstitutionalUserAdapter extends OsfAdapter {
    parentRelationship = 'institution';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'institutional-user': InstitutionalUserAdapter;
    } // eslint-disable-line semi
}
