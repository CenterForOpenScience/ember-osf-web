import OsfSerializer from './osf-serializer';

export default class InstitutionSummaryMetricSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'institution-summary-metric': InstitutionSummaryMetricSerializer;
    } // eslint-disable-line semi
}
