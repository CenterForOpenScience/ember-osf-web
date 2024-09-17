import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import { inject as service } from '@ember/service';

interface TotalCountKpiWrapperArgs {
    model: any;
}

interface TotalCountKpiModel {
    title: string;
    total: number;
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


    @task
    @waitFor
    private async loadData(): Promise<void> {
        const metrics = await this.model;

        this.totalCountKpis.push(
            {
                title: this.intl.t('institutions.dashboard.panel.users'),
                total: metrics.summaryMetrics.userCount,
                icon: 'building',
            },
            {
                title: this.intl.t('institutions.dashboard.panel.projects'),
                // total: metrics.summaryMetrics.userCount,
                total: 100,
                icon: 'atom',
            },
            {
                title: this.intl.t('institutions.dashboard.panel.registrations'),
                // total: metrics.summaryMetrics.userCount,
                total: 1000,
                icon: 'flag',
            },
            {
                title: this.intl.t('institutions.dashboard.panel.preprints'),
                // total: metrics.summaryMetrics.userCount,
                total: 10000,
                icon: 'file-alt',
            },
        );

        this.isLoading = false;
    }
}


