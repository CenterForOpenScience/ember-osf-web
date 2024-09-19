import { attr } from '@ember-data/model';
import OsfModel from './osf-model';

export default class InstitutionSummaryMetricModel extends OsfModel {
    @attr('number') publicProjectCount!: number;
    @attr('number') privateProjectCount!: number;
    @attr('number') userCount!: number;
    @attr('number') publicRegistrationCount!: number;
    @attr('number') preprintCount!: number;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institution-summary-metric': InstitutionSummaryMetricModel;
    } // eslint-disable-line semi
}
