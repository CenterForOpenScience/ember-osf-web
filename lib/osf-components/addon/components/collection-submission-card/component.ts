import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { underscore } from '@ember/string';
import Intl from 'ember-intl/services/intl';

import CollectionSubmissionModel,
{
    CollectionSubmissionReviewStates,
    SubmissionIconMap,
} from 'ember-osf-web/models/collection-submission';
import NodeModel from 'ember-osf-web/models/node';
import { taskFor } from 'ember-concurrency-ts';
import CollectionSubmissionAction from 'ember-osf-web/models/collection-submission-action';

/**
 * Glimmer Arguments
 */
interface CollectionSubmissionModelArguments {
    submission: CollectionSubmissionModel;
}

/**
 * The Collection Submission Card
 */
export default class CollectionSubmissionCard extends Component<CollectionSubmissionModelArguments> {
    /**
     * The injected store
     */
    @service store!: Store;
    /**
     * The injected intl service
     */
     @service intl!: Intl;
    /**
     * The tracked project
     */
    @tracked project?: NodeModel;
    /**
     * The moderation details
     */
    @tracked moderationDetails?: string;
    /**
     * The latest collectionSubmissionAction
     */
    @tracked latestAction?: CollectionSubmissionAction;
    /**
     * The constructor
     *
     * @param owner The owner of the class
     * @param args The args
     */
    constructor(owner: unknown, args: CollectionSubmissionModelArguments) {
        super(owner, args);
        taskFor(this.fetchActions).perform();
        taskFor(this.loadProject).perform();
    }

    get icon() {
        const { reviewsState } = this.args.submission;
        return reviewsState ? SubmissionIconMap[reviewsState] : '';
    }

    get projectMetadata() {
        return this.args.submission.displayChoiceFields
            .map(field => ({
                label: `collections.collection_metadata.${underscore(field)}_label`,
                value: this.args.submission[field],
            }))
            .filter(({ value }) => !!value);
    }

    get showDecisionDropdown() {
        const { reviewsState } = this.args.submission;
        return reviewsState && [
            CollectionSubmissionReviewStates.Pending,
            CollectionSubmissionReviewStates.Accepted].includes(reviewsState);
    }

    @task
    @waitFor
    async fetchActions() {
        const allActions = await this.args.submission.queryHasMany('collectionSubmissionActions');
        this.latestAction = allActions[0];
    }

    /**
     * Get the project
     */
    @task
    @waitFor
    async loadProject() {
        const project = await this.store.findRecord('node', this.args.submission.guid.get('id'));
        this.project = project;
    }
}
