import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';
import Store from '@ember-data/store';
import config from 'ember-osf-web/config/environment';
import { BaseMeta } from 'osf-api';


interface InputArgs {
    guid: string;
}

export default class PreprintMetrics extends Component<InputArgs> {
    @service store!: Store;
    @tracked apiMetrics!: BaseMeta;

    metricsStartDate = config.OSF.metricsStartDate;

    constructor(owner: unknown, args: InputArgs) {
        super(owner, args);

        taskFor(this.loadPreprintMetrics).perform();
    }

    @task
    @waitFor
    private async loadPreprintMetrics()  {
        try {
            const adapterOptions = Object({
                query: {
                    'metrics[views]': 'total',
                    'metrics[downloads]': 'total',
                },
            });

            const preprintMetrics = await this.store.findRecord('preprint', this.args.guid, {
                reload: true,
                adapterOptions,
            });

            this.apiMetrics = preprintMetrics.apiMetrics;
        // eslint-disable-next-line
        } catch (_){ }
    }
}
