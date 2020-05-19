import OsfAdapter from './osf-adapter';

export default class InstitutionDepartmentAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'institution-department': InstitutionDepartmentAdapter;
    } // eslint-disable-line semi
}
