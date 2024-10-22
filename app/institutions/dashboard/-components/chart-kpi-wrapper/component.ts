import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';

import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
import SearchResultModel from 'ember-osf-web/models/search-result';

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
    taskInstance?: TaskInstance<void>;
}

const licenseIndex = 4;
const addonIndex = 5;
const regionIndex = 6;

export default class ChartKpiWrapperComponent extends Component<TotalCountChartWrapperArgs> {
    @service intl!: Intl;
    @service store!: Store;

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

        const getLicenseTask = taskFor(this.getShareData).perform('rights', licenseIndex, 'licenses', 'bar');
        const getAddonsTask = taskFor(this.getShareData).perform('hasOsfAddon', addonIndex, 'add-ons', 'bar');
        const getRegionTask = taskFor(this.getShareData)
            .perform('storageRegion', regionIndex, 'storage-regions', 'doughnut');

        this.kpiCharts.push(
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.users-by-department'),
                chartData: this.calculateUsersByDepartment(metrics.departmentMetrics),
                chartType: 'doughnut',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.public-vs-private-projects.title'),
                chartData: this.calculateProjects(metrics.summaryMetrics),
                chartType: 'doughnut',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.public-vs-private-registrations.title'),
                chartData: this.calculateRegistrations(metrics.summaryMetrics),
                chartType: 'doughnut',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.total-osf-objects.title'),
                chartData: this.calculateOSFObjects(metrics.summaryMetrics),
                chartType: 'doughnut',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.licenses'),
                chartData: [],
                chartType: 'bar',
                taskInstance: getLicenseTask,
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.add-ons'),
                chartData: [],
                chartType: 'bar',
                taskInstance: getAddonsTask,
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-chart.storage-regions'),
                chartData: [],
                chartType: 'doughnut',
                taskInstance: getRegionTask,
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
     * getShareData
     *
     * @description Abstracted task to fetch data associated with the institution from SHARE
     * @param propertyPath The property path to search for
     * (e.g. propertyPathKey in the `related-property-path` of an index-card-search)
     * @param dataPointerProperty The property on this component to store the data in
     * @param index The index to store the data in the kpiCharts array
     * @param translationKey The translation key to use for the title of the chart
     *
     * @returns The total of private and public projects
     */
    @task
    @waitFor
    private async getShareData(
        propertyPath: string,
        index: number,
        translationKey: string,
        graphType?: string,
    ) {
        const valueSearch = await this.store.queryRecord('index-value-search', {
            cardSearchFilter: {
                affiliation: this.args.model.institution.iris.join(','),
            },
            sort: '-relevance',
            'page[size]': 10,
            valueSearchPropertyPath: propertyPath,
        });
        const resultPage = valueSearch.searchResultPage.toArray();

        const chartData = resultPage.map((result: SearchResultModel) => ({
            total: result.cardSearchResultCount,
            label: result.indexCard.get('label'),
        }));

        const kpiChartObject = {
            title: this.intl.t('institutions.dashboard.kpi-chart.' + translationKey),
            chartData,
            chartType: graphType ? graphType : 'bar',

        };
        this.kpiCharts[index] = kpiChartObject;

        this.kpiCharts = [...this.kpiCharts]; // re-set the array to trigger a re-render
    }
}
