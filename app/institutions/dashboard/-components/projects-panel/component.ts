import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { ChartData, ChartOptions } from 'ember-cli-chart';
import Intl from 'ember-intl/services/intl';

import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';

export default class ProjectsPanel extends Component {
    summaryMetrics!: InstitutionSummaryMetricModel;
    @alias('summaryMetrics.privateProjectCount') numPrivateProjects!: number;
    @alias('summaryMetrics.publicProjectCount') numPublicProjects!: number;
    @service intl!: Intl;

    chartOptions: ChartOptions = {
        aspectRatio: 1,
        legend: {
            display: false,
        },
    };

    @computed('numPrivateProjects', 'numPublicProjects')
    get numProjects(): number {
        return this.numPublicProjects + this.numPrivateProjects;
    }

    @computed('numPrivateProjects', 'numPublicProjects')
    get chartData(): ChartData {
        return {
            labels: [
                this.intl.t('institutions.dashboard.public'),
                this.intl.t('institutions.dashboard.private'),
            ],
            datasets: [{
                data: [
                    this.numPublicProjects,
                    this.numPrivateProjects,
                ],
                backgroundColor: [
                    '#36b183',
                    '#a5b3bd',
                ],
            }],
        };
    }
}
