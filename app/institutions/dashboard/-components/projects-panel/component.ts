import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { ChartData, ChartOptions } from 'ember-cli-chart';
import I18N from 'ember-i18n/services/i18n';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class ProjectsPanel extends Component {
    institution!: InstitutionModel;
    @alias('institution.statSummary.numPublicProjects') numPublicProjects!: number;
    @alias('institution.statSummary.numPrivateProjects') numPrivateProjects!: number;
    @service i18n!: I18N;

    chartOptions: ChartOptions = {
        aspectRatio: 1,
        legend: {
            display: false,
        },
    };

    @computed('institution.statSummary.{numPrivateProjects,numPublicProjects}')
    get numProjects(): number {
        return this.numPublicProjects + this.numPrivateProjects;
    }

    @computed('institution.statSummary.{numPrivateProjects,numPublicProjects}')
    get chartData(): ChartData {
        return {
            labels: [
                this.i18n.t('institutions.dashboard.public'),
                this.i18n.t('institutions.dashboard.private'),
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
