import { A } from '@ember/array';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import RegistrationModel from 'ember-osf-web/models/registration';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import CollectionSubmissionModel from 'ember-osf-web/models/collection-submission';
import CollectionSubmissionActionModel from 'ember-osf-web/models/collection-submission-action';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import SchemaResponseActionModel from 'ember-osf-web/models/schema-response-action';

interface Args {
    registration: RegistrationModel;
    revision: SchemaResponseModel;
    collectionSubmission: CollectionSubmissionModel;
}

type AllActionModels = ReviewActionModel | SchemaResponseActionModel | CollectionSubmissionActionModel;

export default class ReviewActionsList extends Component<Args> {
    @service toast!: Toast;
    @service intl!: Intl;

    @tracked showFullActionList = false;
    @tracked reviewActions?: AllActionModels[];

    get showOrHide() {
        return this.showFullActionList ? this.intl.t('osf-components.reviewActionsList.hide')
            : this.intl.t('osf-components.reviewActionsList.show');
    }

    get latestAction() {
        const { reviewActions } = this;
        return A(reviewActions || []).objectAt(0);
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.fetchActions).perform();
    }

    @task
    @waitFor
    async fetchActions() {
        try {
            if (this.args.registration) {
                this.reviewActions = await this.args.registration.reviewActions as ReviewActionModel[];
            }
            if (this.args.revision) {
                this.reviewActions = await this.args.revision.actions as SchemaResponseActionModel[];
            }
            if (this.args.collectionSubmission) {
                const submission = this.args.collectionSubmission;
                this.reviewActions = await submission.queryHasMany ('collectionSubmissionActions',
                    {
                        sort: '-date_modified',
                    });

            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
            throw e;
        }
    }

    @action
    toggleActionList() {
        this.showFullActionList = !this.showFullActionList;
    }
}
