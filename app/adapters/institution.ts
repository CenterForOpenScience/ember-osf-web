import OsfAdapter from './osf-adapter';

export default class InstitutionAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        institution: InstitutionAdapter;
    } // eslint-disable-line semi
}
