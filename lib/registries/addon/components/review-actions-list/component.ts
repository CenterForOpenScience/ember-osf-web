import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import RegistrationModel from 'ember-osf-web/models/registration';
import ReviewActionModel from 'ember-osf-web/models/review-action';

interface Args {
    registration: RegistrationModel;
}

export default class ReviewActionsList extends Component<Args> {
    @tracked showFullActionList: boolean = false;
    @tracked reviewActions?: ReviewActionModel[];

    get toggleIcon() {
        return this.showFullActionList ? 'caret-down' : 'caret-right';
    }

    get latestAction() {
        const { reviewActions } = this;
        return (reviewActions || [])[0];
    }

    @task({ withTestWaiter: true })
    fetchActions = task(function *(this: ReviewActionsList) {
        const reviewActions = yield this.args.registration.reviewActions;
        this.reviewActions = reviewActions.toArray();
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
