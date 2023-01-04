import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import config from 'ember-get-config';
import CollectionSubmission from 'ember-osf-web/models/collection-submission';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Node from 'ember-osf-web/models/node';

export default class GuidEdit extends Controller {
    @alias('model.taskInstance.value.provider') provider!: CollectionProvider;
    @alias('model.taskInstance.value.collection') collection!: Collection;
    @alias('model.taskInstance.value.collectionSubmission') collectionSubmission!: CollectionSubmission;
    @alias('model.taskInstance.value.collectionItem') collectionItem!: Node;

    isPageDirty = false;

    @computed('collectionSubmission.hasDirtyAttributes')
    get isCollectionSubmissionDirty() {
        return this.collectionSubmission.hasDirtyAttributes;
    }

    @action
    returnToProjectOverviewPage() {
        // change to using `transitionToRoute()` once the project overview page is in Ember
        window.location.href = `${config.OSF.url}${this.collectionItem.id}`;
    }

    @action
    setPageDirty() {
        this.set('isPageDirty', true);
    }

    @action
    resetPageDirty() {
        this.set('isPageDirty', false);
    }
}
