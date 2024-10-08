import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import { inject as service } from '@ember/service';
import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
/*
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
*/

export interface ChartDataModel {
    label: string;
    total: number;
}

interface TotalCountChartWrapperArgs {
    model: any;
}

export interface KpiChartModel {
    title: string;
    chartData: ChartDataModel[];
    chartType: string;
}

export default class ChartKpiWrapperComponent extends Component<TotalCountChartWrapperArgs> {
    @service intl!: Intl;
    @tracked model = this.args.model;
    @tracked kpiCharts = [] as KpiChartModel[];
    @tracked isLoading = true;

    constructor(owner: unknown, args: TotalCountChartWrapperArgs) {
        super(owner, args);

        taskFor(this.loadData).perform();
    }

    /**
     * loadData
     *
     * @description Loads all the data and builds the chart data before rendering the page
     *
     * @returns a void Promise
     */
    @task
    @waitFor
    private async loadData(): Promise<void> {
        const metrics = await this.model;

        this.kpiCharts.push(
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.users-by-department'),
                chartData: this.calculateUsersByDepartment(metrics.departmentMetrics),
                chartType: 'doughnut',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.public-vs-private-projects.title'),
                chartData: this.calculateProjects(metrics.summaryMetrics),
                chartType: 'pie',
            },
            /*
            {
                title: this.intl.t('institutions.dashboard.panel.registrations'),
                chartData: [
                    {
                        label: 'a',
                        total: metrics.summaryMetrics.userCount,
                    } as ChartDataModel,
                    {
                        label: 'a',
                        total: metrics.summaryMetrics.userCount,
                    } as ChartDataModel,
                ],
                chartType: 'bar',
            },
            {
                title: this.intl.t('institutions.dashboard.panel.preprints'),
                chartData: [
                    {
                        label: 'a',
                        total: metrics.summaryMetrics.userCount,
                    } as ChartDataModel,
                    {
                        label: 'a',
                        total: metrics.summaryMetrics.userCount,
                    } as ChartDataModel,
                ],
                chartType: 'line',
            },
            */
        );

        this.isLoading = false;
    }

    /**
     * calculateUserByDepartments
     *
     * @description Abstracted method to build the ChartData model for deparments
     * @param departmentMetrics The department metrics object
     *
     * @returns The users by department ChartData model
     */
    private calculateUsersByDepartment(departmentMetrics: InstitutionDepartmentModel[]): ChartDataModel[] {
        const departmentData = [] as ChartDataModel[];

        departmentMetrics.forEach((metric: InstitutionDepartmentModel ) => {
            departmentData.push(
                {
                    label: metric.name,
                    total: metric.numberOfUsers,
                } as ChartDataModel,
            );
        });
        return departmentData;
    }

    /**
     * calculateProjects
     *
     * @description Abstracted method to calculate the private and public projects
     * @param summaryMetrics The institutional summary metrics object
     *
     * @returns The total of private and public projects
     */
    private calculateProjects(summaryMetrics: InstitutionSummaryMetricModel): ChartDataModel[] {
        return [
            {
                label: this.intl.t('institutions.dashboard.kpi-chart.public-vs-private-projects.public'),
                total: summaryMetrics.publicProjectCount,
            } as ChartDataModel,
            {
                label: this.intl.t('institutions.dashboard.kpi-chart.public-vs-private-projects.private'),
                total: summaryMetrics.privateProjectCount,
            } as ChartDataModel,
        ];
    }
}


