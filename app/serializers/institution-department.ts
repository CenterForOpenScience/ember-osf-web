import OsfSerializer from './osf-serializer';

export default class InstitutionDepartmentSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'institution-department': InstitutionDepartmentSerializer;
    } // eslint-disable-line semi
}
