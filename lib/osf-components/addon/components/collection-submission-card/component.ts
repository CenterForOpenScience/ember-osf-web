import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import CollectionSubmissionModel from 'ember-osf-web/models/collection-submission';
import NodeModel from 'ember-osf-web/models/node';
import { taskFor } from 'ember-concurrency-ts';
import { Args } from 'osf-components/components/editable-field/provider-metadata-manager/component';

/**
 * Glimmer Arguments
 */
interface CollectionSubmissionModelArguments {
    submission: CollectionSubmissionModel;
}

/**
 * Metadata Arguments
 */
interface MetadataArgument {
    /**
     * The display name representing the metadata
     */
    metadata: string;
    /**
     * The key represented on the collection submission. Ie: volume
     */
    key: keyof CollectionSubmissionModel;
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
     * The tracked project
     */
    @tracked project?: NodeModel;
    /**
     * The in
     */
    @service intl!: Intl;
    /**
     * The moderation details
     */
    @tracked moderationDetails?: string;

    /**
     * The project metadata
     */
    @tracked projectMetadata?: string;

    private metadataDisplay: MetadataArgument[];

    /**
     * The constructor
     *
     * @param owner The owner of the class
     * @param args The args
     */
    constructor(owner: unknown, args: Args) {
        super(owner, args);

        this.metadataDisplay = [
            {
                metadata: 'Issue',
                key: 'issue' as keyof CollectionSubmissionModel,
            } as MetadataArgument,
            {
                metadata: 'Program Area',
                key: 'programArea' as keyof CollectionSubmissionModel,
            } as MetadataArgument,
            {
                metadata: 'School Type',
                key: 'schoolType' as keyof CollectionSubmissionModel,
            } as MetadataArgument,
            {
                metadata: 'Status',
                key: 'status' as keyof CollectionSubmissionModel,
            } as MetadataArgument,
            {
                metadata: 'Study Design',
                key: 'studyDesign' as keyof CollectionSubmissionModel,
            } as MetadataArgument,
            {
                metadata: 'Type',
                key: 'collectedType' as keyof CollectionSubmissionModel,
            } as MetadataArgument,
            {
                metadata: 'Volume',
                key: 'volume' as keyof CollectionSubmissionModel,
            } as MetadataArgument,
        ];

        taskFor(this.loadProject).perform();
    }

    /**
     * Get the project
     */
    @task
    @waitFor
    async loadProject() {
        const project = await this.store.findRecord('node', this.args.submission.guid.get('id'));
        this.project = project;

        this.buildProjectMetadata();

        /**
         * TODO
         * find the collection-submission-action for the status * and data
         * I am uncertain how the moderator gets tied to the collection-submission-action
         * I am uncertain about the ordering of the actions to determine the last item
         * await this.store.findAll('collection-submission-action',)
         */

        this.moderationDetails = this.intl.t(
            'osf-components.moderators.all.moderationDetails',
            { status: 'status', date: 'date', moderator:'moderator'},
        );
    }

    /**
     * buildProjectMetadata
     *
     * @description Builds all the project meta data taking into account
     * if the items are empty
     */
    private buildProjectMetadata(): void {
        this.projectMetadata = '';

        this.metadataDisplay.forEach((metadata: MetadataArgument) => {
            this.projectMetadata += this.getProjectMetadata(metadata.metadata, metadata.key);
        });

        this.projectMetadata = this.projectMetadata.replace(/,\s$/g, '');
    }

    /**
     * getProjectMetadata
     *
     * @description Gets the project meta data for a specific item taking
     * into account if the item is empty
     *
     * @param metadataType the metadata type
     * @param key the actual metadata key
     *
     */
    private getProjectMetadata(metadataType: string, key: keyof CollectionSubmissionModel): string{
        return this.args.submission.get(key) ?
            this.intl.t(
                'osf-components.moderators.all.projectMetadataDisplay',
                { metadataType, metadata: this.args.submission[key]},
            ) : '';
    }
}
