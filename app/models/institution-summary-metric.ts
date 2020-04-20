import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr } = DS;

export default class InstitutionSummaryMetricsModel extends OsfModel {
    @attr('number') publicProjectCount!: number;
    @attr('number') privateProjectCount!: number;
    @attr('number') userCount!: number;
}
