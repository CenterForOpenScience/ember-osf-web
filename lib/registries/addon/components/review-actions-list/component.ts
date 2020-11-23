import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import Toast from 'ember-toastr/services/toast';

import RegistrationModel from 'ember-osf-web/models/registration';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface Args {
    registration: RegistrationModel;
}

export default class ReviewActionsList extends Component<Args> {
    @service toast!: Toast;

    @tracked showFullActionList: boolean = false;
    @tracked reviewActions?: ReviewActionModel[];

    get showOrHide() {
        return this.showFullActionList ? 'Hide' : 'Show full history';
    }

    get latestAction() {
        const { reviewActions } = this;
        return (reviewActions || [])[0];
    }

    @task({ withTestWaiter: true })
    fetchActions = task(function *(this: ReviewActionsList) {
        try {
            const reviewActions = yield this.args.registration.reviewActions;
            this.reviewActions = reviewActions.toArray();
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.fetchActions.perform();
    }

    @action
    toggleActionList() {
        this.showFullActionList = !this.showFullActionList;
    }
}
