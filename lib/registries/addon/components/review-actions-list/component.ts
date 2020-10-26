import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import ReviewActionModel from 'ember-osf-web/models/review-action';

interface Args {
    reviewActions?: ReviewActionModel[];
}

export default class ReviewActionsList extends Component<Args> {
    @tracked showFullActionList: boolean = false;

    get toggleIcon() {
        return this.showFullActionList ? 'caret-down' : 'caret-right';
    }

    get latestAction() {
        const { reviewActions } = this.args;
        return (reviewActions || [])[0];
    }

    @action
    toggleActionList() {
        this.showFullActionList = !this.showFullActionList;
    }
}
