import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr } = DS;

export default class InstitutionSummaryMetricModel extends OsfModel {
    @attr('number') publicProjectCount!: number;
    @attr('number') privateProjectCount!: number;
    @attr('number') userCount!: number;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institution-summary-metric': InstitutionSummaryMetricModel;
    } // eslint-disable-line semi
}
