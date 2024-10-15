import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import { inject as service } from '@ember/service';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';

interface TotalCountKpiWrapperArgs {
    model: any;
}

interface TotalCountKpiModel {
    title: string;
    total: number | string;
    icon: string;
}

export default class TotalCountKpiWrapperComponent extends Component<TotalCountKpiWrapperArgs> {
    @service intl!: Intl;
    @tracked model = this.args.model;
    @tracked totalCountKpis = [] as TotalCountKpiModel[];
    @tracked isLoading = true;

    constructor(owner: unknown, args: TotalCountKpiWrapperArgs) {
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
        const metrics: { summaryMetrics: InstitutionSummaryMetricModel } = await this.model;

        this.totalCountKpis.push(
            {
                title: this.intl.t('institutions.dashboard.kpi-panel.users'),
                total: metrics.summaryMetrics.userCount,
                icon: 'users',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-panel.logged-in-users'),
                total: metrics.summaryMetrics.monthlyLoggedInUserCount,
                icon: 'users',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-panel.active-users'),
                total: metrics.summaryMetrics.monthlyActiveUserCount,
                icon: 'users',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-panel.projects'),
                total: this.calculateProjects(metrics.summaryMetrics),
                icon: 'flask',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-panel.registrations'),
                total: metrics.summaryMetrics.publicRegistrationCount,
                icon: 'archive',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-panel.preprints'),
                total: metrics.summaryMetrics.publishedPreprintCount,
                icon: 'file-alt',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-panel.file-count'),
                total: metrics.summaryMetrics.publicFileCount,
                icon: 'file-alt',
            },
            {
                title: this.intl.t('institutions.dashboard.kpi-panel.storage'),
                total: metrics.summaryMetrics.convertedStorageCount,
                icon: 'database',
            },
        );

        this.isLoading = false;
    }
}


