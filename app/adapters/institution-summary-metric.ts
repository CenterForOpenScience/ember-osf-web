import OsfAdapter from './osf-adapter';

export default class InstitutionSummaryMetricAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'institution-summary-metric': InstitutionSummaryMetricAdapter;
    } // eslint-disable-line semi
}
