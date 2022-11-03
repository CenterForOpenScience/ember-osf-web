import Component from '@ember/component';
import { action} from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import CollectionSubmissionModel from 'ember-osf-web/models/collection-submission';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class CollectionSubmissionCard extends Component {
    /**
     * Should do something
     */
    collectionSubmission!: CollectionSubmissionModel;

    shouldOpenDecisionDialog = false;
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
