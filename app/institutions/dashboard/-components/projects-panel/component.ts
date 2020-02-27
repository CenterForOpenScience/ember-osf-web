import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { ChartData, ChartOptions } from 'ember-cli-chart';
import Intl from 'ember-intl/services/intl';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class ProjectsPanel extends Component {
    institution!: InstitutionModel;
    @alias('institution.statSummary.numPublicProjects') numPublicProjects!: number;
    @alias('institution.statSummary.numPrivateProjects') numPrivateProjects!: number;
    @service intl!: Intl;

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
