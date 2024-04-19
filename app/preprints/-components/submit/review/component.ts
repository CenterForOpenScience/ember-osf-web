import Store from '@ember-data/store';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
 * The Review Args
 */
interface ReviewArgs {
    manager: PreprintStateMachine;
}

/**
 * The Review Component
 */
export default class Review extends Component<ReviewArgs>{
    @service store!: Store;
    @tracked preprint = this.args.manager.preprint;
    @tracked provider?: any;
    @tracked license?: any;
    @tracked subjects?: any;

    constructor(owner: unknown, args: ReviewArgs) {
        super(owner, args);

        taskFor(this.loadPreprint).perform();
    }

    @task
    @waitFor
    private async loadPreprint()  {
        // this.preprint = await this.store.findRecord('preprint', 'osf-approved-admin');
        this.provider = this.preprint.provider;
        this.license = this.preprint.license;
        this.subjects = await this.preprint.queryHasMany('subjects');
    }

    public get providerLogo(): string | undefined {
        return this.provider.get('assets')?.square_color_no_transparent;

    }
}
