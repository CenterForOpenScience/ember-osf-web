import { action} from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import CollectionSubmissionModel from 'ember-osf-web/models/collection-submission';

interface CollectionSubmissionModelArgs {
    submission: CollectionSubmissionModel;
}

export default class CollectionSubmissionCard extends Component<CollectionSubmissionModelArgs> {
    @tracked shouldOpenDecisionDialog = false;
    status!: string;
    date!: string;
    moderator!: string;

    @action
    openMakeDecisionDialog() {
        this.shouldOpenDecisionDialog = true;
    }

    @action
    closeDecisionDialog() {
        this.shouldOpenDecisionDialog = false;
    }
}
