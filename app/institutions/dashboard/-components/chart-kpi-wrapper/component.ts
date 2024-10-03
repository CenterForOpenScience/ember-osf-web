import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import { inject as service } from '@ember/service';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';

interface TotalCountChartWrapperArgs {
    model: any;
}

interface TotalCountChartModel {
    title: string;
    total: number;
    chart: string;
}

export default class ChartKpiWrapperComponent extends Component<TotalCountChartWrapperArgs> {
    @service intl!: Intl;
    @tracked model = this.args.model;
    @tracked totalCountCharts = [] as TotalCountChartModel[];
    @tracked isLoading = true;

    constructor(owner: unknown, args: TotalCountChartWrapperArgs) {
        super(owner, args);

        taskFor(this.loadData).perform();
    }

    /**
     * calculateProjects
     *
     * @description Abstracted method to calculate the private and public projects
     * @param summaryMetrics The institutional summary metrics object
     *
     * @returns The total of private and public projects
     */
    private calculateProjects(summaryMetrics: InstitutionSummaryMetricModel): number {
        return summaryMetrics.privateProjectCount + summaryMetrics.publicProjectCount;
    }

    @task
    @waitFor
    private async loadData(): Promise<void> {
        const metrics = await this.model;

        this.totalCountCharts.push(
            {
                title: this.intl.t('institutions.dashboard.panel.users'),
                total: metrics.summaryMetrics.userCount,
                chart: 'doughnut',
            },
            {
                title: this.intl.t('institutions.dashboard.panel.projects'),
                total: this.calculateProjects(metrics.summaryMetrics),
                chart: 'pie',
            },
            {
                title: this.intl.t('institutions.dashboard.panel.registrations'),
                total: metrics.summaryMetrics.publicRegistrationCount,
                chart: 'bar',
            },
            {
                title: this.intl.t('institutions.dashboard.panel.preprints'),
                total: metrics.summaryMetrics.preprintCount,
                chart: 'line',
            },
        );

        this.isLoading = false;
    }
}


