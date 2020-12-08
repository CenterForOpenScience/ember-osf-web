import { A } from '@ember/array';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import RegistrationModel from 'ember-osf-web/models/registration';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface Args {
    registration: RegistrationModel;
}

export default class ReviewActionsList extends Component<Args> {
    @service toast!: Toast;
    @service intl!: Intl;

    @tracked showFullActionList: boolean = false;
    @tracked reviewActions?: ReviewActionModel[];

    get showOrHide() {
        return this.showFullActionList ? this.intl.t('registries.reviewActionsList.hide')
            : this.intl.t('registries.reviewActionsList.show');
    }

    get latestAction() {
        const { reviewActions } = this;
        return A(reviewActions || []).objectAt(0);
    }

    @task({ withTestWaiter: true })
    fetchActions = task(function *(this: ReviewActionsList) {
        try {
            this.reviewActions = yield this.args.registration.reviewActions;
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
            throw e;
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
