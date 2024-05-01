import Store from '@ember-data/store';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment-timezone';
import Intl from 'ember-intl/services/intl';

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
    @tracked contributors?: any;
    @tracked subjects?: any;
    @service intl!: Intl;

    constructor(owner: unknown, args: ReviewArgs) {
        super(owner, args);

        taskFor(this.loadPreprint).perform();
    }

    @task
    @waitFor
    private async loadPreprint()  {
        // this.preprint = await this.store.findRecord('preprint', 'osf-not-contributor');
        // this.preprint = await this.store.findRecord('preprint', 'osf-approved-admin');
        // this.preprint = await this.store.findRecord('preprint', 'osf-approved');
        this.provider = this.preprint.provider.content;
        this.license = this.preprint.license;
        this.subjects = await this.preprint.queryHasMany('subjects');
    }

    public get providerLogo(): string | undefined {
        return this.provider.get('assets')?.square_color_no_transparent;
    }

    public  get displayPublicationDoi(): string {
        return this.preprint.articleDoiUrl || this.intl.t('general.not-applicable');
    }

    public  get displayPublicationDate(): string {
        return this.preprint.originalPublicationDate
            ? moment(this.preprint.originalPublicationDate).format('YYYY-MM-DD')
            : this.intl.t('general.not-applicable');
    }

    public  get displayPublicationCitation(): string {
        return this.preprint.originalPublicationCitation
            ? this.preprint.originalPublicationCitation
            : this.intl.t('general.not-applicable');
    }

    public get providerServiceLabel(): string {
        return this.intl.t('preprints.submit.step-five.preprint-service',
            { singularPreprintWord: this.provider.documentType.singularCapitalized });
    }
}
