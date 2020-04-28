import OsfAdapter from './osf-adapter';

export default class InstitutionUserAdapter extends OsfAdapter {
    parentRelationship = 'institution';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'institution-user': InstitutionUserAdapter;
    } // eslint-disable-line semi
}
