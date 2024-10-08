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
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.public-vs-private-registrations.title'),
                chartData: this.calculateRegistrations(metrics.summaryMetrics),
                chartType: 'bar',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.total-osf-objects.title'),
                chartData: this.calculateOSFObjects(metrics.summaryMetrics),
                chartType: 'line',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.licenses'),
                chartData: this.calculateLicenses(metrics.departmentMetrics),
                chartType: 'radar',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.add-ons'),
                chartData: this.calculateAddons(metrics.departmentMetrics),
                chartType: 'polarArea',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.storage-regions'),
                chartData: this.calculateStorageRegions(metrics.departmentMetrics),
                chartType: 'bubble',
            },
        );

        this.isLoading = false;
    }

    /**
     * calculateUserByDepartments
     *
     * @description Abstracted method to build the ChartData model for departments
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
     * calculateRegistrations
     *
     * @description Abstracted method to calculate the private and public registrations
     * @param summaryMetrics The institutional summary metrics object
     *
     * @returns The total of private and public registrations
     */
    private calculateRegistrations(summaryMetrics: InstitutionSummaryMetricModel): ChartDataModel[] {
        return [
            {
                label: this.intl.t('institutions.dashboard.kpi-chart.public-vs-private-registrations.public'),
                total: summaryMetrics.publicRegistrationCount,
            } as ChartDataModel,
            {
                label: this.intl.t('institutions.dashboard.kpi-chart.public-vs-private-registrations.private'),
                total: summaryMetrics.embargoedRegistrationCount,
            } as ChartDataModel,
        ];
    }

    /**
     * calculateOSFObjects
     *
     * @description Abstracted method to calculate the osf objects
     *
     * @param summaryMetrics The institutional summary metrics object
     *
     * @returns The total OSF objects
     */
    private calculateOSFObjects(summaryMetrics: InstitutionSummaryMetricModel): ChartDataModel[] {
        let chartData = [
            {
                label: this.intl.t('institutions.dashboard.kpi-chart.total-osf-objects.preprints'),
                total: summaryMetrics.preprintCount,
            } as ChartDataModel,
        ];

        chartData = chartData.concat(this.calculateProjects(summaryMetrics));

        chartData = chartData.concat(this.calculateRegistrations(summaryMetrics));

        return chartData;
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

    /**
     * calculateLicenses
     *
     * @description Abstracted method to build the ChartData model for licenses
     * @param licenseMetrics The license metrics object
     *
     * @returns The licenses ChartData model
     */
    private calculateLicenses(licenseMetrics: InstitutionDepartmentModel[]): ChartDataModel[] {
        const licenseData = [] as ChartDataModel[];

        licenseMetrics.forEach((metric: InstitutionDepartmentModel ) => {
            licenseData.push(
                {
                    label: metric.name,
                    total: metric.numberOfUsers,
                } as ChartDataModel,
            );
        });
        return licenseData;
    }

    /**
     * calculateAddons
     *
     * @description Abstracted method to build the ChartData model for add-ons
     * @param addonMetrics The add-on metrics object
     *
     * @returns The add-ons ChartData model
     */
    private calculateAddons(addonMetrics: InstitutionDepartmentModel[]): ChartDataModel[] {
        const addonData = [] as ChartDataModel[];

        addonMetrics.forEach((metric: InstitutionDepartmentModel ) => {
            addonData.push(
                {
                    label: metric.name,
                    total: metric.numberOfUsers,
                } as ChartDataModel,
            );
        });
        return addonData;
    }

    /**
     * calculateStorageRegions
     *
     * @description Abstracted method to build the Storage Regions ChartData
     * @param storageRegionsMetrics The storage regions metrics object
     *
     * @returns The storage regions ChartData model
     */
    private calculateStorageRegions(storageRegionsMetrics: InstitutionDepartmentModel[]): ChartDataModel[] {
        const storageRegionsData = [] as ChartDataModel[];

        storageRegionsMetrics.forEach((metric: InstitutionDepartmentModel ) => {
            storageRegionsData.push(
                {
                    label: metric.name,
                    total: metric.numberOfUsers,
                } as ChartDataModel,
            );
        });
        return storageRegionsData;
    }
}


